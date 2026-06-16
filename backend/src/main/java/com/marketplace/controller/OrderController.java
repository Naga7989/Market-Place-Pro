package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.entity.Order;
import com.marketplace.enums.OrderStatus;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.service.OrderService;
import com.marketplace.dto.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Orders", description = "Order management APIs")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Place a new order")
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Long addressId = Long.parseLong(body.get("addressId").toString());
        String paymentMethod = (String) body.getOrDefault("paymentMethod", "COD");
        String couponCode = (String) body.get("couponCode");

        Order order = orderService.placeOrder(currentUser.getUserId(), addressId, paymentMethod, couponCode);
        return ResponseEntity.status(201).body(ApiResponse.success("Order placed successfully", order));
    }

    @Operation(summary = "Get my orders")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Order>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Page<Order> orders = orderService.getMyOrders(currentUser.getUserId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(orders)));
    }

    @Operation(summary = "Get order by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrder(id, currentUser.getUserId())));
    }

    @Operation(summary = "Cancel an order")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        orderService.cancelOrder(id, currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", null));
    }

    @Operation(summary = "Get orders for vendor")
    @GetMapping("/vendor")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<Order>>> getVendorOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Page<Order> orders = orderService.getOrdersByVendor(currentUser.getUserId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(orders)));
    }

    @Operation(summary = "Update order status (Vendor/Admin)")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", null));
    }
}
