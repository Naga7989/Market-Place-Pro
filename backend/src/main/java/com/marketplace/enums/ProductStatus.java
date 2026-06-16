package com.marketplace.enums;

/** Visibility and availability states for products. */
public enum ProductStatus {
    DRAFT,          // Saved but not yet published
    ACTIVE,         // Live and visible to customers
    INACTIVE,       // Hidden from customers by seller
    OUT_OF_STOCK    // All inventory depleted
}
