package com.marketplace.service;

import com.marketplace.entity.*;
import com.marketplace.enums.OrderStatus;
import com.marketplace.enums.PaymentMethod;
import com.marketplace.enums.PaymentStatus;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final NotificationService notificationService;

    private static final BigDecimal DELIVERY_CHARGE = BigDecimal.valueOf(49);
    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(499);
    private static final BigDecimal GST_RATE = BigDecimal.valueOf(0.18);
    private static final BigDecimal COMMISSION_RATE = BigDecimal.valueOf(0.05);

    @Transactional
    public Order placeOrder(Long userId, Long addressId, String paymentMethod, String couponCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(address);           // ✅ correct field name
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        try {
            order.setPaymentMethod(PaymentMethod.valueOf(paymentMethod.toUpperCase()));
        } catch (Exception e) {
            order.setPaymentMethod(PaymentMethod.COD);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product == null) continue;

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setVendor(product.getVendor());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setTotalPrice(cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItem.setProductNameSnapshot(product.getName()); // OrderItem has no status field
            orderItems.add(orderItem);

            subtotal = subtotal.add(orderItem.getTotalPrice());

            // Reserve inventory
            inventoryRepository.reserveStock(product.getId(), cartItem.getQuantity());
        }

        BigDecimal deliveryCharges = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0
                ? BigDecimal.ZERO : DELIVERY_CHARGE;
        BigDecimal taxAmount = subtotal.multiply(GST_RATE);
        BigDecimal total = subtotal.add(deliveryCharges).add(taxAmount);

        order.setSubtotal(subtotal);
        order.setDeliveryCharges(deliveryCharges);    // ✅ correct field name
        order.setTaxAmount(taxAmount);                 // ✅ correct field name
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(total);
        order.setExpectedDeliveryAt(LocalDateTime.now().plusDays(5)); // ✅ correct field name
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteByCartId(cart.getId());

        // Send notification
        notificationService.sendOrderNotification(user, savedOrder.getOrderNumber(), "CONFIRMED");

        log.info("Order placed: {} for user: {}", savedOrder.getOrderNumber(), userId);
        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrder(Long orderId, Long userId) {
        return orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
    }

    @Transactional(readOnly = true)
    public Page<Order> getMyOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED).contains(order.getStatus())) {
            throw new BadRequestException("Order cannot be cancelled at this stage");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        User user = userRepository.findById(userId).orElseThrow();
        notificationService.sendOrderNotification(user, order.getOrderNumber(), "CANCELLED");
        log.info("Order cancelled: {} by user: {}", orderId, userId);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(status);

        OrderTracking tracking = new OrderTracking();
        tracking.setOrder(order);
        tracking.setStatus(status); // ✅ OrderTracking.status is OrderStatus enum, not String
        tracking.setDescription(getStatusDescription(status));
        if (order.getTrackingHistory() == null) order.setTrackingHistory(new ArrayList<>());
        order.getTrackingHistory().add(tracking);

        orderRepository.save(order);
        notificationService.sendOrderNotification(order.getUser(), order.getOrderNumber(), status.name());
    }

    @Transactional(readOnly = true)
    public Page<Order> getOrdersByVendor(Long vendorId, Pageable pageable) {
        return orderRepository.findByVendorId(vendorId, pageable);
    }

    private String generateOrderNumber() {
        return "MKP-" + java.time.LocalDate.now().getYear() + "-" +
                String.format("%06d", (int) (Math.random() * 999999));
    }

    private String getStatusDescription(OrderStatus status) {
        return switch (status) {
            case CONFIRMED -> "Your order has been confirmed";
            case PROCESSING -> "Your order is being processed";
            case SHIPPED -> "Your order has been shipped";
            case OUT_FOR_DELIVERY -> "Your order is out for delivery";
            case DELIVERED -> "Your order has been delivered successfully";
            case CANCELLED -> "Your order has been cancelled";
            default -> status.name().replace("_", " ");
        };
    }
}
