package com.marketplace.enums;

/** All possible states of a product order lifecycle. */
public enum OrderStatus {
    PENDING,            // Order placed, awaiting confirmation
    CONFIRMED,          // Confirmed by seller
    PROCESSING,         // Being prepared/packed
    SHIPPED,            // Dispatched from warehouse
    OUT_FOR_DELIVERY,   // With delivery agent
    DELIVERED,          // Successfully delivered
    CANCELLED,          // Cancelled by user or seller
    RETURN_REQUESTED,   // Customer requested return
    RETURNED,           // Item returned to seller
    REFUNDED            // Refund processed
}
