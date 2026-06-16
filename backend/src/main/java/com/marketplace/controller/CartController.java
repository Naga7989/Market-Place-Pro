package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.entity.Cart;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Cart", description = "Shopping cart management APIs")
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Get current cart")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCart(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Cart cart = cartService.getOrCreateCart(currentUser.getUserId());
        CartService.CartSummary summary = cartService.getCartSummary(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("cart", cart, "summary", summary)));
    }

    @Operation(summary = "Add product to cart")
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Cart>> addToCart(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Long productId = Long.parseLong(body.get("productId").toString());
        Long variantId = body.get("variantId") != null ? Long.parseLong(body.get("variantId").toString()) : null;
        int quantity = Integer.parseInt(body.getOrDefault("quantity", 1).toString());
        Cart cart = cartService.addToCart(currentUser.getUserId(), productId, variantId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Added to cart", cart));
    }

    @Operation(summary = "Update cart item quantity")
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Cart cart = cartService.updateCartItem(currentUser.getUserId(), itemId, body.get("quantity"));
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @Operation(summary = "Remove item from cart")
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable Long itemId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        cartService.removeFromCart(currentUser.getUserId(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", null));
    }

    @Operation(summary = "Clear cart")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal CustomUserDetails currentUser) {
        cartService.clearCart(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
