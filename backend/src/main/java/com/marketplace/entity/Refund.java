package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Refund record linked to an order or booking cancellation. */
@Entity
@Table(name = "refunds", indexes = {
        @Index(name = "idx_refunds_order_id", columnList = "order_id"),
        @Index(name = "idx_refunds_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    /** PENDING, PROCESSED, FAILED */
    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";

    /** Razorpay refund ID */
    @Column(length = 100)
    private String razorpayRefundId;

    @Column(length = 1000)
    private String reason;

    /** TO_SOURCE, TO_WALLET */
    @Column(length = 30)
    @Builder.Default
    private String refundMode = "TO_SOURCE";

    private LocalDateTime processedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
