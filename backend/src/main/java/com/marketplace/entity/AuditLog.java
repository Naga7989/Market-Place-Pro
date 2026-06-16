package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/** System-wide audit log for tracking all significant actions. */
@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_logs_user_id", columnList = "user_id"),
        @Index(name = "idx_audit_logs_resource_type", columnList = "resource_type"),
        @Index(name = "idx_audit_logs_created_at", columnList = "created_at")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 100)
    private String resourceType;

    @Column(length = 100)
    private String resourceId;

    /** JSON snapshot of the entity before the change */
    @Column(columnDefinition = "TEXT")
    private String oldValue;

    /** JSON snapshot of the entity after the change */
    @Column(columnDefinition = "TEXT")
    private String newValue;

    @Column(length = 50)
    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 500)
    private String endpoint;

    @Column(length = 10)
    private String httpMethod;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSuccess = true;

    @Column(length = 500)
    private String errorMessage;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
