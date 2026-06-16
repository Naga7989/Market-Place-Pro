package com.marketplace.repository;

import com.marketplace.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    // ✅ Cart has 'user' relationship — Spring Data resolves user.id automatically
    Optional<Cart> findByUserId(Long userId);
    // ✅ Removed findBySessionId — Cart entity has no sessionId field
    void deleteByUserId(Long userId);
}
