package com.marketplace.service;

import com.marketplace.entity.*;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private static final BigDecimal DELIVERY_CHARGE = BigDecimal.valueOf(49);
    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(499);
    private static final BigDecimal GST_RATE = BigDecimal.valueOf(0.18);

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(userFrom(userId));   // ✅ Cart has User relationship, not userId
            return cartRepository.save(cart);
        });
    }

    // Helper: create a User proxy for relationship setting
    private User userFrom(Long userId) {
        User user = new User();
        user.setId(userId);   // Hibernate will treat this as a proxy reference
        return user;
    }

    @Transactional
    public Cart addToCart(Long userId, Long productId, Long variantId, int quantity) {
        if (quantity <= 0) throw new BadRequestException("Quantity must be at least 1");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductIdAndVariantId(cart.getId(), productId, variantId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setUnitPrice(product.getSalePrice());   // ✅ correct field: salePrice
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setUnitPrice(product.getSalePrice()); // ✅ correct field: salePrice
            cartItemRepository.save(newItem);
        }

        return cart;
    }

    @Transactional
    public Cart updateCartItem(Long userId, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return cart;
    }

    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
        }
    }

    @Transactional(readOnly = true)
    public CartSummary getCartSummary(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) return new CartSummary(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, 0);

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        BigDecimal subtotal = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryCharge = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0
                ? BigDecimal.ZERO : DELIVERY_CHARGE;
        BigDecimal gst = subtotal.multiply(GST_RATE);
        BigDecimal total = subtotal.add(deliveryCharge).add(gst);

        return new CartSummary(subtotal, deliveryCharge, gst, total, items.size());
    }

    public record CartSummary(BigDecimal subtotal, BigDecimal deliveryCharge,
                               BigDecimal gstAmount, BigDecimal total, int itemCount) {}
}
