package com.marketplace.repository;

import com.marketplace.entity.Booking;
import com.marketplace.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);
    Optional<Booking> findByIdAndUserId(Long id, Long userId);
    Optional<Booking> findByIdAndProviderId(Long id, Long providerId);

    Page<Booking> findByUserIdAndStatus(Long userId, BookingStatus status, Pageable pageable);
    Page<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status, Pageable pageable);

    // ✅ Booking has no 'scheduledAt' — use createdAt for date range filtering
    @Query("SELECT b FROM Booking b WHERE b.provider.id = :providerId AND b.createdAt BETWEEN :start AND :end")
    List<Booking> findByProviderAndDateRange(@Param("providerId") Long providerId,
                                              @Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.id = :providerId AND b.status = 'COMPLETED'")
    Long countCompletedByProviderId(@Param("providerId") Long providerId);
}
