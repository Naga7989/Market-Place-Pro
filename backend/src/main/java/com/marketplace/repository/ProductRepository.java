package com.marketplace.repository;

import com.marketplace.entity.Product;
import com.marketplace.enums.ProductStatus;
import com.marketplace.enums.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);
    Optional<Product> findByIdAndStatus(Long id, ProductStatus status);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    Page<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);
    Page<Product> findByVendorIdAndStatus(Long vendorId, ProductStatus status, Pageable pageable);
    Page<Product> findByVendorId(Long vendorId, Pageable pageable);

    List<Product> findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc(ProductStatus status, Pageable pageable);

    // ✅ Product field is 'salePrice' not 'sellingPrice'
    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.category.id = :categoryId AND p.id != :excludeId ORDER BY p.salePrice ASC")
    List<Product> findRelatedProducts(@Param("categoryId") Long categoryId, @Param("excludeId") Long excludeId,
                                       @Param("status") ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.salePrice BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) AND p.status = 'ACTIVE'")
    Page<Product> searchByName(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.productType = :type AND p.status = 'ACTIVE'")
    Page<Product> findByProductType(@Param("type") ProductType type, Pageable pageable);

    boolean existsBySkuAndVendorId(String sku, Long vendorId);
}
