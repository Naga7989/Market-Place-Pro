package com.marketplace.controller;

import com.marketplace.dto.request.LoginRequest;
import com.marketplace.dto.request.OtpLoginRequest;
import com.marketplace.dto.request.OtpSendRequest;
import com.marketplace.dto.request.RegisterRequest;
import com.marketplace.dto.response.ApiResponse;
import com.marketplace.dto.response.AuthResponse;
import com.marketplace.enums.OtpPurpose;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.service.AuthService;
import com.marketplace.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Authentication", description = "User authentication and authorization APIs")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @Operation(summary = "Register a new user account")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", response));
    }

    @Operation(summary = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @Operation(summary = "Send OTP to mobile number")
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody OtpSendRequest request) {
        OtpPurpose purpose = OtpPurpose.LOGIN;
        if (request.getPurpose() != null) {
            try { purpose = OtpPurpose.valueOf(request.getPurpose()); } catch (IllegalArgumentException ignored) {}
        }
        otpService.sendOtp(request.getPhone(), purpose);
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully to your mobile number", null));
    }

    @Operation(summary = "Login with mobile OTP")
    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtpAndLogin(@Valid @RequestBody OtpLoginRequest request) {
        AuthResponse response = authService.loginWithOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", response));
    }

    @Operation(summary = "Refresh access token using refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Refresh token is required"));
        }
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @Operation(summary = "Logout and invalidate tokens")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal CustomUserDetails currentUser) {
        authService.logout(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
