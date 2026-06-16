package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Promotional coupon for discounts on orders/services. */
@Entity
@Table(name = "coupons", indexes = {
        @Index(name = "idx_coupons_code", columnList = "code", unique = true)
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DiscountType discountType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    /** Minimum cart value for coupon to apply */
    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal minimumOrderAmount = BigDecimal.ZERO;

    /** Maximum discount cap (for PERCENT type) */
    @Column(precision = 10, scale = 2)
    private BigDecimal maximumDiscountAmount;

    /** 0 = unlimited */
    @Column(nullable = false)
    @Builder.Default
    private Integer usageLimit = 0;

    /** Per-user usage limit (0 = unlimited) */
    @Column(nullable = false)
    @Builder.Default
    private Integer perUserLimit = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer usedCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /** Whether applicable only for first order */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isFirstOrderOnly = false;

    /** Applicable to specific vendors only */
    @Column(length = 500)
    private String applicableVendorIds;

    /** Applicable to specific categories only */
    @Column(length = 500)
    private String applicableCategoryIds;

    @Column(nullable = false)
    private LocalDateTime validFrom;

    @Column(nullable = false)
    private LocalDateTime validUntil;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
