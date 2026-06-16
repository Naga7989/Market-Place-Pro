package com.marketplace.repository;

import com.marketplace.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    Page<ProductReview> findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId AND r.isApproved = true")
    Double getAverageRating(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM ProductReview r WHERE r.product.id = :productId AND r.isApproved = true")
    Long countApprovedByProductId(@Param("productId") Long productId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
