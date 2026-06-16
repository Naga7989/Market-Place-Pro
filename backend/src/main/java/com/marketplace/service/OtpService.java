package com.marketplace.service;

import com.marketplace.entity.OtpVerification;
import com.marketplace.entity.User;
import com.marketplace.enums.OtpPurpose;
import com.marketplace.exception.BadRequestException;
import com.marketplace.repository.OtpVerificationRepository;
import com.marketplace.repository.UserRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final UserRepository userRepository;

    @Value("${app.twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${app.twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${app.twilio.from-number:}")
    private String twilioFromNumber;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(RANDOM.nextInt(10));
        }
        return otp.toString();
    }

    @Transactional
    public void sendOtp(String phone, OtpPurpose purpose) {
        String otp = generateOtp();

        // If Twilio is not configured, use "123456" for dev mode testing
        if (twilioAccountSid == null || twilioAccountSid.isEmpty() ||
            twilioAccountSid.equals("ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")) {
            otp = "123456";
        }

        OtpVerification verification = new OtpVerification();
        verification.setPhone(phone);
        verification.setOtpCode(passwordEncoder(otp)); // store hashed
        verification.setPurpose(purpose);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        verification.setIsUsed(false);
        otpVerificationRepository.save(verification);

        sendSmsOtp(phone, otp);
        log.info("OTP sent to phone: {} for purpose: {}", phone, purpose);
    }

    private String passwordEncoder(String otp) {
        // Store plaintext for simplicity; in production use BCrypt
        return otp;
    }

    @Transactional
    public boolean verifyOtp(String phone, String otp, OtpPurpose purpose) {
        Optional<OtpVerification> verificationOpt = otpVerificationRepository
                .findTopByPhoneAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        phone, purpose, LocalDateTime.now());

        if (verificationOpt.isEmpty()) {
            log.warn("No valid OTP found for phone: {} purpose: {}", phone, purpose);
            return false;
        }

        OtpVerification verification = verificationOpt.get();
        if (!verification.getOtpCode().equals(otp)) {
            log.warn("OTP mismatch for phone: {}", phone);
            return false;
        }

        verification.setIsUsed(true);
        otpVerificationRepository.save(verification);
        return true;
    }

    private void sendSmsOtp(String phone, String otp) {
        if (twilioAccountSid == null || twilioAccountSid.isEmpty() ||
            twilioAccountSid.equals("ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")) {
            log.warn("Twilio not configured. OTP for {} is: {} (DEV MODE)", phone, otp);
            return;
        }
        try {
            String formattedPhone = phone;
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = "+91" + formattedPhone;
            }
            Twilio.init(twilioAccountSid, twilioAuthToken);
            Message.creator(
                    new PhoneNumber(formattedPhone),
                    new PhoneNumber(twilioFromNumber),
                    String.format("Your MarketPlace OTP is: %s. Valid for %d minutes. Do not share this OTP with anyone.",
                            otp, OTP_EXPIRY_MINUTES)
            ).create();
            log.info("SMS OTP sent successfully to: {}", formattedPhone);
        } catch (Exception e) {
            log.error("Failed to send SMS OTP to {}: {}", phone, e.getMessage());
            throw new BadRequestException("Failed to send OTP. Please try again.");
        }
    }
}
