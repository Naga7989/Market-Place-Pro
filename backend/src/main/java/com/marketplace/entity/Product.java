package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.ProductStatus;
import com.marketplace.enums.ProductType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Product entity — the core listing in the marketplace.
 * Supports physical, digital, and service-type products.
 * INR pricing with optional discount.
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_slug", columnList = "slug"),
        @Index(name = "idx_products_vendor_id", columnList = "vendor_id"),
        @Index(name = "idx_products_category_id", columnList = "category_id"),
        @Index(name = "idx_products_status", columnList = "status"),
        @Index(name = "idx_products_sku", columnList = "sku")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String name;

    @Column(unique = true, nullable = false, length = 320)
    private String slug;

    @Column(unique = true, length = 100)
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    /** Base price in INR (paisa stored as BigDecimal) */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    /** Current selling price (may be same as basePrice or discounted) */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salePrice;

    /** Discount percentage 0-100 */
    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    /** Cost price for vendor margin calculation */
    @Column(precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProductStatus status = ProductStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProductType productType = ProductType.PHYSICAL;

    /** Whether this product is featured on the homepage */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    /** Whether this product is eligible for flash sales */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isFlashSaleEligible = false;

    /** Average rating (0.0 to 5.0) */
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer salesCount = 0;

    /** Weight in kilograms for shipping calculation */
    @Column(precision = 8, scale = 3)
    private BigDecimal weightKg;

    /** Dimensions in cm: LxWxH (stored as JSON string) */
    @Column(length = 100)
    private String dimensions;

    /** HSN code for GST compliance */
    @Column(length = 20)
    private String hsnCode;

    /** GST rate percentage */
    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal gstRate = BigDecimal.ZERO;

    /** Downloadable file URL for DIGITAL products */
    @Column(length = 500)
    private String digitalFileUrl;

    /** SEO meta title */
    @Column(length = 200)
    private String metaTitle;

    /** SEO meta description */
    @Column(length = 500)
    private String metaDescription;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // ======================== RELATIONSHIPS ========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnore
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private List<ProductSpecification> specifications = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Inventory inventory;

    @ManyToMany(fetch = FetchType.LAZY)
    @org.hibernate.annotations.BatchSize(size = 50)
    @JoinTable(
            name = "product_tags",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<ProductReview> reviews = new ArrayList<>();
}
