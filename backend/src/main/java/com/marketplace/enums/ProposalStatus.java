package com.marketplace.enums;

/** Lifecycle states of a freelancer's project proposal. */
public enum ProposalStatus {
    PENDING,        // Submitted, awaiting client review
    SHORTLISTED,    // Shortlisted by client for consideration
    ACCEPTED,       // Proposal accepted, project awarded
    REJECTED,       // Rejected by client
    WITHDRAWN       // Withdrawn by freelancer
}
