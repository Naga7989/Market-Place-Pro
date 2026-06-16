package com.marketplace.enums;

/** Lifecycle states for client projects on the freelancer marketplace. */
public enum ProjectStatus {
    OPEN,           // Accepting proposals
    IN_PROGRESS,    // Freelancer hired, work in progress
    COMPLETED,      // Project successfully delivered and closed
    CANCELLED       // Project cancelled by client
}
