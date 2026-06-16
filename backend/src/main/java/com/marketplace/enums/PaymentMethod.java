package com.marketplace.enums;

/** Supported payment methods on the platform (India-first, INR). */
public enum PaymentMethod {
    RAZORPAY,       // Razorpay payment gateway
    UPI,            // Unified Payments Interface
    CREDIT_CARD,    // Credit card payment
    DEBIT_CARD,     // Debit card payment
    WALLET,         // Platform wallet balance
    COD,            // Cash on Delivery
    BANK_TRANSFER   // Direct bank transfer / NEFT / RTGS
}
