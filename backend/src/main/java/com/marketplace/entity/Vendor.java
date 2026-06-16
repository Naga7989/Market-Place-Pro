package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Vendor entity representing a seller/business registered on the platform.
 * A vendor can have multiple stores and products.
 */
@Entity
@Table(name = "vendors", indexes = {
        @Index(name = "idx_vendors_user_id", columnList = "user_id"),
        @Index(name = "idx_vendors_status", columnList = "status"),
        @Index(name = "idx_vendors_gstin", columnList = "gstin")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 200)
    private String businessName;

    @Column(unique = true, length = 20)
    private String gstin;

    @Column(length = 50)
    private String pan;

    @Column(length = 500)
    private String businessDescription;

    @Column(length = 500)
    private String logoUrl;

    @Column(length = 500)
    private String bannerUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private VendorStatus status = VendorStatus.PENDING;

    /** Overall vendor rating (0.0 to 5.0) */
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalSales = 0;

    /** Platform commission rate override (null = platform default) */
    @Column(precision = 5, scale = 2)
    private BigDecimal commissionRate;

    // ======================== BUSINESS ADDRESS ========================

    @Column(length = 500)
    private String addressLine1;

    @Column(length = 500)
    private String addressLine2;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    // ======================== BANK DETAILS ========================

    @Column(length = 100)
    private String bankAccountName;

    @Column(length = 30)
    private String bankAccountNumber;

    @Column(length = 20)
    private String ifscCode;

    @Column(length = 100)
    private String bankName;

    // ======================== KYC DOCUMENTS ========================

    @Column(length = 500)
    private String kycDocumentUrl;

    @Column(length = 500)
    private String gstCertificateUrl;

    private LocalDateTime approvedAt;

    @Column(length = 500)
    private String rejectionReason;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // ======================== RELATIONSHIPS ========================

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Store> stores = new ArrayList<>();

    @OneToMany(mappedBy = "vendor", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}
