package com.marketplace.repository;

import com.marketplace.entity.OtpVerification;
import com.marketplace.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByPhoneAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String phone, OtpPurpose purpose, LocalDateTime now);

    Optional<OtpVerification> findTopByEmailAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String email, OtpPurpose purpose, LocalDateTime now);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.expiresAt < :now OR o.isUsed = true")
    void deleteExpiredOtps(LocalDateTime now);
}
