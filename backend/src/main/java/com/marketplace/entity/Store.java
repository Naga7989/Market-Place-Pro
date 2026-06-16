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
 * Store entity representing a storefront within a vendor account.
 * One vendor can operate multiple stores (e.g., different product categories).
 */
@Entity
@Table(name = "stores", indexes = {
        @Index(name = "idx_stores_vendor_id", columnList = "vendor_id"),
        @Index(name = "idx_stores_slug", columnList = "slug")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnore
    private Vendor vendor;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(unique = true, nullable = false, length = 220)
    private String slug;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String logoUrl;

    @Column(length = 500)
    private String bannerUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    /** Return policy text */
    @Column(length = 2000)
    private String returnPolicy;

    /** Shipping policy text */
    @Column(length = 2000)
    private String shippingPolicy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "store", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}
