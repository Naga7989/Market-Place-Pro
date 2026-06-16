package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Core user entity representing any authenticated person on the platform.
 * Users can have multiple roles (CUSTOMER, SELLER, FREELANCER, etc.)
 * and are the central entity linking all platform activities.
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_phone", columnList = "phone"),
        @Index(name = "idx_users_referral_code", columnList = "referral_code")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(unique = true, length = 15)
    private String phone;

    @JsonIgnore
    @Column(name = "password_hash", length = 255)
    private String password;

    @Column(length = 500)
    private String avatarUrl;

    @Column(length = 500)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private UserRole primaryRole = UserRole.CUSTOMER;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isEmailVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPhoneVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isBanned = false;

    @Column(length = 500)
    private String banReason;

    @Column(length = 10)
    private String referralCode;

    @Column(length = 255)
    private String emailVerificationToken;

    @Column(length = 255)
    private String passwordResetToken;

    private LocalDateTime passwordResetTokenExpiry;

    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @Column(length = 10)
    private String preferredLanguage;

    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // ======================== RELATIONSHIPS ========================

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Wishlist> wishlistItems = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Wallet wallet;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();
}
