package com.marketplace.repository;

import com.marketplace.entity.Payment;
import com.marketplace.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByBookingId(Long bookingId);
    Page<Payment> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") PaymentStatus status);
}
