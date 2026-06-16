package com.marketplace.repository;

import com.marketplace.entity.Vendor;
import com.marketplace.enums.VendorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByUserId(Long userId);
    // ✅ Vendor entity has 'gstin' not 'gstNumber'
    Optional<Vendor> findByGstin(String gstin);
    Page<Vendor> findByStatus(VendorStatus status, Pageable pageable);
    boolean existsByUserId(Long userId);
    // ✅ Vendor entity has 'gstin' and 'pan' not 'gstNumber'/'panNumber'
    boolean existsByGstin(String gstin);
    boolean existsByPan(String pan);
}
