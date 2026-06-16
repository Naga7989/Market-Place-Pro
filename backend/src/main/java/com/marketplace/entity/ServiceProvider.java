package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** A professional offering on-demand services (plumber, electrician, etc.). */
@Entity
@Table(name = "service_providers", indexes = {
        @Index(name = "idx_service_providers_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 200)
    private String businessName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 500)
    private String profileImageUrl;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalBookings = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /** Years of professional experience */
    @Column
    private Integer experienceYears;

    /** Service area (city/zone coverage) */
    @Column(length = 500)
    private String serviceArea;

    /** Languages spoken */
    @Column(length = 200)
    private String languages;

    @Column(length = 500)
    private String idProofUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MarketplaceService> services = new ArrayList<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ServiceAvailability> availabilities = new ArrayList<>();
}
