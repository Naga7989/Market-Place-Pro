package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Referral program tracking between users. */
@Entity
@Table(name = "referrals", indexes = {
        @Index(name = "idx_referrals_referrer_id", columnList = "referrer_id"),
        @Index(name = "idx_referrals_referred_id", columnList = "referred_id", unique = true)
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_id", nullable = false)
    private User referrer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_id", nullable = false, unique = true)
    private User referred;

    @Column(nullable = false, length = 20)
    private String referralCode;

    /** PENDING, REWARDED */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    /** Reward credited to referrer */
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal referrerReward = BigDecimal.ZERO;

    /** Discount given to referred user */
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal referredDiscount = BigDecimal.ZERO;

    private LocalDateTime rewardedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
