package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * User address entity.
 * Users can have multiple addresses; one is marked as default.
 */
@Entity
@Table(name = "addresses", indexes = {
        @Index(name = "idx_addresses_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 500)
    private String addressLine1;

    @Column(length = 500)
    private String addressLine2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 10)
    private String pincode;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String country = "India";

    /** Address type: HOME, WORK, OTHER */
    @Column(length = 20)
    @Builder.Default
    private String addressType = "HOME";

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    /** GPS latitude for delivery routing */
    private Double latitude;

    /** GPS longitude for delivery routing */
    private Double longitude;

    @Column(length = 500)
    private String landmark;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
