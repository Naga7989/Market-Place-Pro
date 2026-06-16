package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/** Tracks stock for a product (or specific variant). */
@Entity
@Table(name = "inventory", indexes = {
        @Index(name = "idx_inventory_product_id", columnList = "product_id"),
        @Index(name = "idx_inventory_variant_id", columnList = "variant_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    /** Units reserved for pending orders (not yet confirmed) */
    @Column(nullable = false)
    @Builder.Default
    private Integer reservedQuantity = 0;

    /** Low stock alert threshold */
    @Column(nullable = false)
    @Builder.Default
    private Integer lowStockThreshold = 5;

    /** Warehouse location reference */
    @Column(length = 100)
    private String warehouseLocation;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /** Computed available stock */
    @Transient
    public int getAvailableQuantity() {
        return Math.max(0, quantity - reservedQuantity);
    }
}
