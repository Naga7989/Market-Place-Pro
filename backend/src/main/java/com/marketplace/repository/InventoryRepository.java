package com.marketplace.repository;

import com.marketplace.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductIdAndVariantIdIsNull(Long productId);
    Optional<Inventory> findByProductIdAndVariantId(Long productId, Long variantId);

    @Modifying
    @Query("UPDATE Inventory i SET i.reservedQuantity = i.reservedQuantity + :qty WHERE i.product.id = :productId AND i.quantity >= i.reservedQuantity + :qty")
    int reserveStock(@Param("productId") Long productId, @Param("qty") int qty);

    @Modifying
    @Query("UPDATE Inventory i SET i.quantity = i.quantity - :qty, i.reservedQuantity = i.reservedQuantity - :qty WHERE i.product.id = :productId AND i.quantity >= :qty")
    int deductStock(@Param("productId") Long productId, @Param("qty") int qty);
}
