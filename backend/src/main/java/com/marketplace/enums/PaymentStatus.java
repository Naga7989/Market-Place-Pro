package com.marketplace.enums;

/** Status of a payment transaction. */
public enum PaymentStatus {
    PENDING,        // Payment initiated but not completed
    COMPLETED,      // Payment successfully captured
    FAILED,         // Payment failed/declined
    REFUNDED,       // Full refund processed
    PARTIALLY_PAID  // Partial payment received
}
