package com.marketplace.repository;

import com.marketplace.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);
    Optional<CartItem> findByCartIdAndProductIdAndVariantId(Long cartId, Long productId, Long variantId);
    Optional<CartItem> findByIdAndCartId(Long id, Long cartId);
    void deleteByCartId(Long cartId);
    int countByCartId(Long cartId);
}
