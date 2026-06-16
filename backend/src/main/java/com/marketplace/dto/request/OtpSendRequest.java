package com.marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OtpSendRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Please provide a valid Indian mobile number")
    private String phone;

    private String purpose; // REGISTRATION, LOGIN, PASSWORD_RESET, PHONE_VERIFY
}
