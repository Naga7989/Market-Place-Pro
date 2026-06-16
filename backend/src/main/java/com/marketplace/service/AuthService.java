package com.marketplace.service;

import com.marketplace.dto.request.*;
import com.marketplace.dto.response.AuthResponse;
import com.marketplace.dto.response.UserSummaryDto;
import com.marketplace.entity.*;
import com.marketplace.enums.OtpPurpose;
import com.marketplace.enums.UserRole;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ConflictException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.exception.UnauthorizedException;
import com.marketplace.repository.*;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.security.CustomUserDetailsService;
import com.marketplace.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final OtpService otpService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("An account with this phone number already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.setIsEmailVerified(false);
        user.setIsPhoneVerified(false);

        // Assign role — use a final variable for lambda compatibility
        UserRole roleEnum = UserRole.CUSTOMER;
        if (request.getRole() != null) {
            try { roleEnum = UserRole.valueOf(request.getRole()); } catch (IllegalArgumentException ignored) {}
        }
        final UserRole finalRoleEnum = roleEnum; // ✅ effectively final for lambda
        Role role = roleRepository.findByName(finalRoleEnum.name())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + finalRoleEnum));
        user.setRoles(new HashSet<>(Set.of(role)));

        User savedUser = userRepository.save(user);

        // Create wallet for new user
        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(java.math.BigDecimal.ZERO);
wallet.setIsActive(true);
        walletRepository.save(wallet);

        // Send welcome notification async
        notificationService.sendWelcomeNotification(savedUser);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());
        saveRefreshToken(savedUser, refreshToken);

        log.info("New user registered: {}", savedUser.getEmail());
        return buildAuthResponse(accessToken, refreshToken, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
            saveRefreshToken(user, refreshToken);

            log.info("User logged in: {}", user.getEmail());
            return buildAuthResponse(accessToken, refreshToken, user);

        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Transactional
    public AuthResponse loginWithOtp(OtpLoginRequest request) {
        boolean valid = otpService.verifyOtp(request.getPhone(), request.getOtp(), OtpPurpose.LOGIN);
        if (!valid) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        String phone = request.getPhone();
        User user = userRepository.findByPhone(phone)
                .or(() -> {
                    if (phone.startsWith("+91")) {
                        return userRepository.findByPhone(phone.substring(3));
                    } else if (phone.length() == 10) {
                        return userRepository.findByPhone("+91" + phone);
                    }
                    return java.util.Optional.empty();
                })
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this phone number"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Your account has been suspended");
        }

        user.setIsPhoneVerified(true);
        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
        saveRefreshToken(user, refreshToken);

        return buildAuthResponse(accessToken, refreshToken, user);
    }

    public AuthResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndIsRevokedFalse(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshToken.setIsRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new UnauthorizedException("Refresh token has expired, please login again");
        }

        String email = jwtTokenProvider.extractEmail(token);
        CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        refreshToken.setIsRevoked(true);
        refreshTokenRepository.save(refreshToken);
        saveRefreshToken(user, newRefreshToken);

        return buildAuthResponse(newAccessToken, newRefreshToken, user);
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("User logged out: userId={}", userId);
    }

    @Transactional
    private void saveRefreshToken(User user, String token) {
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setToken(token);
        refreshTokenEntity.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenEntity.setIsRevoked(false);
        refreshTokenRepository.save(refreshTokenEntity);
    }

    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getName())
                .collect(Collectors.toSet());

        UserSummaryDto userDto = UserSummaryDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .isEmailVerified(user.getIsEmailVerified())
                .isPhoneVerified(user.getIsPhoneVerified())
                .roles(roles)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userDto)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }
}
