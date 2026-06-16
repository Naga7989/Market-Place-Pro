package com.marketplace.repository;

import com.marketplace.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByTokenAndIsRevokedFalse(String token);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.user.id = :userId")
    void revokeAllByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId AND rt.isRevoked = true")
    void deleteRevokedByUserId(Long userId);
}
