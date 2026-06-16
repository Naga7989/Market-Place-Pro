package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.OtpPurpose;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Stores generated OTPs for phone-based verification flows.
 * Each OTP is scoped to a purpose to prevent cross-flow reuse.
 */
@Entity
@Table(name = "otp_verifications", indexes = {
        @Index(name = "idx_otp_phone_purpose", columnList = "phone, purpose")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(length = 15)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(nullable = false, length = 10)
    private String otpCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OtpPurpose purpose;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isUsed = false;

    /** Count failed verification attempts to lock out brute force */
    @Column(nullable = false)
    @Builder.Default
    private Integer failedAttempts = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
