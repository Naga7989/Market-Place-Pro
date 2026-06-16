package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/** Customer support ticket for issue resolution. */
@Entity
@Table(name = "support_tickets", indexes = {
        @Index(name = "idx_support_tickets_user_id", columnList = "user_id"),
        @Index(name = "idx_support_tickets_status", columnList = "status"),
        @Index(name = "idx_support_tickets_ticket_number", columnList = "ticket_number")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 300)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    /** OPEN, IN_PROGRESS, RESOLVED, CLOSED */
    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "OPEN";

    /** LOW, MEDIUM, HIGH, CRITICAL */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String priority = "MEDIUM";

    /** Category: ORDER, PAYMENT, ACCOUNT, PRODUCT, SERVICE, GENERAL */
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String category = "GENERAL";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRated = false;

    /** Customer satisfaction rating 1-5 */
    private Integer satisfactionRating;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
