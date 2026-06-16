package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Delivery partner who fulfills last-mile delivery for product orders. */
@Entity
@Table(name = "delivery_partners", indexes = {
        @Index(name = "idx_delivery_partners_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(length = 20)
    private String vehicleType;

    @Column(length = 50)
    private String vehicleNumber;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    /** Current GPS latitude */
    private Double currentLatitude;

    /** Current GPS longitude */
    private Double currentLongitude;

    @Column(length = 100)
    private String currentCity;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalDeliveries = 0;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(length = 500)
    private String idProofUrl;

    @Column(length = 500)
    private String licenseUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
