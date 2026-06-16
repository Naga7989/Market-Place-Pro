package com.marketplace.enums;

/** Lifecycle states for service bookings. */
public enum BookingStatus {
    PENDING,        // Booking requested, awaiting provider confirmation
    CONFIRMED,      // Confirmed by service provider
    IN_PROGRESS,    // Service is being performed
    COMPLETED,      // Service successfully completed
    CANCELLED,      // Cancelled by user or provider
    NO_SHOW         // Customer was not available at scheduled time
}
