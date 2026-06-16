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

/**
 * A service offering by a provider (e.g., "AC Repair - 1 Ton").
 * Named MarketplaceService to avoid conflict with java.util.Service.
 */
@Entity
@Table(name = "marketplace_services", indexes = {
        @Index(name = "idx_services_provider_id", columnList = "provider_id"),
        @Index(name = "idx_services_category_id", columnList = "category_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class MarketplaceService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    @JsonIgnore
    private ServiceProvider provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Base price in INR */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    /** Estimated duration in minutes */
    @Column
    private Integer durationMinutes;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    /** Home visit or centre-based */
    @Column(length = 30)
    @Builder.Default
    private String serviceMode = "HOME_VISIT";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TimeSlot> timeSlots = new ArrayList<>();
}
