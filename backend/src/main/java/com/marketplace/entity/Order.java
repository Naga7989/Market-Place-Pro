package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.OrderStatus;
import com.marketplace.enums.PaymentMethod;
import com.marketplace.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** Customer product order. INR amounts with all pricing breakdown fields. */
@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_orders_user_id", columnList = "user_id"),
        @Index(name = "idx_orders_order_number", columnList = "order_number"),
        @Index(name = "idx_orders_status", columnList = "status"),
        @Index(name = "idx_orders_created_at", columnList = "created_at")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id", nullable = false)
    private Address shippingAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    /** Subtotal before discounts, taxes */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    /** Discount amount from coupon/offer */
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    /** Delivery charges in INR */
    @Column(nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal deliveryCharges = BigDecimal.ZERO;

    /** GST/tax amount */
    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    /** Final order total in INR */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    /** Platform commission earned */
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal commissionAmount = BigDecimal.ZERO;

    @Column(length = 50)
    private String couponCode;

    @Column(length = 2000)
    private String customerNotes;

    /** Expected delivery date */
    private LocalDateTime expectedDeliveryAt;

    private LocalDateTime deliveredAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderTracking> trackingHistory = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Payment payment;
}
