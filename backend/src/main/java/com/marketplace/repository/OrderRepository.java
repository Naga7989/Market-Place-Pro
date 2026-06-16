package com.marketplace.repository;

import com.marketplace.entity.Order;
import com.marketplace.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Order has 'user' relationship → Spring Data derives user.id from findByUserId
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    List<Order> findByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, List<OrderStatus> statuses);

    // ✅ OrderItem has 'vendor' relationship → use i.vendor.id
    @Query("SELECT o FROM Order o JOIN o.items i WHERE i.vendor.id = :vendorId ORDER BY o.createdAt DESC")
    Page<Order> findByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    Long countByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // ✅ PaymentStatus enum value is COMPLETED not PAID
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'COMPLETED' AND o.createdAt BETWEEN :start AND :end")
    BigDecimal sumRevenueByPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // ✅ OrderItem has no commissionAmount field — estimate commission as % of total revenue
    @Query("SELECT COALESCE(SUM(oi.totalPrice), 0) FROM OrderItem oi JOIN oi.order o WHERE o.paymentStatus = 'COMPLETED' AND o.createdAt BETWEEN :start AND :end")
    BigDecimal sumCommissionByPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);
}
