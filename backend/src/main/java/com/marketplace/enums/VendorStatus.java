package com.marketplace.enums;

/** Lifecycle states for vendor/seller accounts on the platform. */
public enum VendorStatus {
    PENDING,        // Application submitted, awaiting review
    UNDER_REVIEW,   // Being reviewed by admin
    APPROVED,       // Approved and active on platform
    SUSPENDED,      // Temporarily suspended
    REJECTED        // Application rejected
}
