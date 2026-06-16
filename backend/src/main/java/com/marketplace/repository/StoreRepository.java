package com.marketplace.repository;

import com.marketplace.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByVendorId(Long vendorId);
    Optional<Store> findBySlug(String slug);
    List<Store> findByIsActiveTrueOrderByRatingDesc();
    boolean existsBySlug(String slug);
}
