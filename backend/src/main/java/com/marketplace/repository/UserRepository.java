package com.marketplace.repository;

import com.marketplace.entity.*;
import com.marketplace.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// ============================================================
// USER REPOSITORY
// ============================================================
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByReferralCode(String referralCode);
    Optional<User> findByEmailVerificationToken(String token);
    Optional<User> findByPasswordResetToken(String token);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
    long countByIsActive(Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.isBanned = false AND u.isActive = true AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<User> searchByName(@Param("name") String name, Pageable pageable);
}
