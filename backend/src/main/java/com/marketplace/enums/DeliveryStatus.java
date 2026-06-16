package com.marketplace.enums;

/** Lifecycle states for delivery assignments. */
public enum DeliveryStatus {
    ASSIGNED,       // Order assigned to delivery partner
    ACCEPTED,       // Accepted by delivery partner
    PICKED_UP,      // Package picked up from seller
    IN_TRANSIT,     // En route to customer
    DELIVERED,      // Successfully delivered to customer
    FAILED          // Delivery attempt failed
}
