package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.PaymentMethod;
import com.marketplace.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Payment record for orders, bookings, and projects. Stores Razorpay transaction details. */
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payments_order_id", columnList = "order_id"),
        @Index(name = "idx_payments_user_id", columnList = "user_id"),
        @Index(name = "idx_payments_razorpay_order_id", columnList = "razorpay_order_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 5)
    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    // Razorpay-specific fields
    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    /** Razorpay method: card, netbanking, upi, wallet */
    @Column(length = 50)
    private String razorpayMethod;

    @Column(length = 100)
    private String razorpayRefundId;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @Column(length = 1000)
    private String failureReason;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String paymentFor = "ORDER"; // ORDER, BOOKING, PROJECT_MILESTONE

    private LocalDateTime capturedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
