package com.marketplace.enums;

/** Purpose of OTP generation to prevent OTP reuse across flows. */
public enum OtpPurpose {
    REGISTRATION,   // New user registration via phone
    LOGIN,          // Passwordless phone login
    PASSWORD_RESET, // Reset forgotten password
    PHONE_VERIFY    // Verify phone number change
}
