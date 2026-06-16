package com.marketplace.enums;

/** Lifecycle states for project milestones. */
public enum MilestoneStatus {
    PENDING,        // Not yet started
    IN_PROGRESS,    // Being worked on
    SUBMITTED,      // Work submitted by freelancer for review
    APPROVED,       // Approved by client
    PAID            // Payment released to freelancer
}
