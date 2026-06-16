package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Product category with self-referential hierarchy support.
 * Supports unlimited nesting depth: Electronics → Mobile Phones → Smartphones.
 */
@Entity
@Table(name = "categories", indexes = {
        @Index(name = "idx_categories_slug", columnList = "slug"),
        @Index(name = "idx_categories_parent_id", columnList = "parent_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@org.hibernate.annotations.BatchSize(size = 50)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 120)
    private String slug;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 100)
    private String icon;

    @Column(nullable = false)
    @Builder.Default
    private Integer level = 1;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    /** SEO meta title */
    @Column(length = 200)
    private String metaTitle;

    /** SEO meta description */
    @Column(length = 500)
    private String metaDescription;

    // ======================== SELF-REFERENTIAL HIERARCHY ========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Category> children = new ArrayList<>();

    // ======================== PRODUCT RELATIONSHIP ========================

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
