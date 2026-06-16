package com.marketplace.enums;

/**
 * Defines all user roles in the marketplace platform.
 * Each role grants specific permissions and access levels.
 */
public enum UserRole {
    CUSTOMER,           // Regular buyer/customer
    SELLER,             // Product vendor/seller
    SERVICE_PROVIDER,   // Offers on-demand services (plumber, electrician, etc.)
    FREELANCER,         // Offers project-based work
    DELIVERY_PARTNER,   // Delivers orders
    VENDOR_MANAGER,     // Manages multiple vendors (B2B)
    ADMIN,              // Platform administrator
    SUPER_ADMIN         // Super administrator with full access
}
