package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/** User loyalty points account for rewards program. */
@Entity
@Table(name = "loyalty_points", indexes = {
        @Index(name = "idx_loyalty_points_user_id", columnList = "user_id", unique = true)
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LoyaltyPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(name = "total_earned", nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(name = "total_redeemed", nullable = false)
    @Builder.Default
    private Integer redeemedPoints = 0;

    @Column(name = "points", nullable = false)
    @Builder.Default
    private Integer availablePoints = 0;

    /** Tier: BRONZE, SILVER, GOLD, PLATINUM */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String tier = "BRONZE";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
