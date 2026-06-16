package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Customer review and rating for a product. */
@Entity
@Table(name = "product_reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "user_id", "order_item_id"})
}, indexes = {
        @Index(name = "idx_product_reviews_product_id", columnList = "product_id"),
        @Index(name = "idx_product_reviews_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    @JsonIgnore
    private OrderItem orderItem;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String comment;

    /** JSON array of review image URLs */
    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerifiedPurchase = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isApproved = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer helpfulCount = 0;

    @Column(length = 1000)
    private String sellerResponse;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
