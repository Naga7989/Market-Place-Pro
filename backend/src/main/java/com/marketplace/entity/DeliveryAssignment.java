package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.DeliveryStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Assignment of an order to a delivery partner. */
@Entity
@Table(name = "delivery_assignments", indexes = {
        @Index(name = "idx_delivery_assignments_order_id", columnList = "order_id"),
        @Index(name = "idx_delivery_assignments_partner_id", columnList = "partner_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DeliveryAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private DeliveryPartner partner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.ASSIGNED;

    @Column(length = 200)
    private String currentLocation;

    /** Delivery fee earned by partner */
    @Column(nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal deliveryFee = BigDecimal.ZERO;

    @Column(length = 500)
    private String deliveryNotes;

    /** OTP to confirm delivery */
    @Column(length = 10)
    private String deliveryOtp;

    private LocalDateTime acceptedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
