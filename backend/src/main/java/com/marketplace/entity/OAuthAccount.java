package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Stores OAuth2 account connections (Google, Facebook, etc.) linked to a user.
 * Allows users to connect multiple OAuth providers to a single account.
 */
@Entity
@Table(name = "oauth_accounts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"provider", "provider_user_id"})
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    /** OAuth provider name: GOOGLE, FACEBOOK, APPLE */
    @Column(nullable = false, length = 30)
    private String provider;

    @Column(name = "provider_user_id", nullable = false, length = 255)
    private String providerUserId;

    @Column(length = 2000)
    @JsonIgnore
    private String accessToken;

    @Column(length = 2000)
    @JsonIgnore
    private String refreshToken;

    private LocalDateTime tokenExpiresAt;

    @Column(length = 500)
    private String profileImageUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
