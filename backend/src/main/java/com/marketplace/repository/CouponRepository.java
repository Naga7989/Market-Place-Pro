package com.marketplace.repository;

import com.marketplace.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeAndIsActiveTrue(String code);
    Optional<Coupon> findByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND c.validFrom <= :now AND c.validUntil >= :now AND (c.usageLimit IS NULL OR c.usedCount < c.usageLimit)")
    List<Coupon> findActiveCoupons(LocalDateTime now);

    boolean existsByCode(String code);
}
