package com.marketplace.repository;

import com.marketplace.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    // ✅ Wallet has 'user' relationship, use user.id not userId
    Optional<Wallet> findByUserId(Long userId);
    Optional<Wallet> findByUserIdAndIsActiveTrue(Long userId);

    @Modifying
    @Query("UPDATE Wallet w SET w.balance = w.balance + :amount WHERE w.user.id = :userId AND w.isActive = true")
    int creditBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("UPDATE Wallet w SET w.balance = w.balance - :amount WHERE w.user.id = :userId AND w.balance >= :amount AND w.isActive = true")
    int debitBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
}
