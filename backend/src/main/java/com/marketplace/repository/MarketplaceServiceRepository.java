package com.marketplace.repository;

import com.marketplace.entity.MarketplaceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MarketplaceServiceRepository extends JpaRepository<MarketplaceService, Long> {
    // ✅ MarketplaceService: isActive(not isAvailable), category(not categoryId), provider(not providerId), NO slug
    Page<MarketplaceService> findByIsActiveTrueOrderByRatingDesc(Pageable pageable);
    Page<MarketplaceService> findByCategoryAndIsActiveTrue(
            com.marketplace.entity.ServiceCategory category, Pageable pageable);
    Page<MarketplaceService> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);
    Page<MarketplaceService> findByCategoryIdInAndIsActiveTrue(java.util.List<Long> categoryIds, Pageable pageable);
    Page<MarketplaceService> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);
    // ✅ No slug field — search by name instead
    Optional<MarketplaceService> findByName(String name);
}
