package com.marketplace.service;

import com.marketplace.entity.*;
import com.marketplace.enums.PaymentStatus;
import com.marketplace.enums.PaymentMethod;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.PaymentException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.OrderRepository;
import com.marketplace.repository.PaymentRepository;
import com.marketplace.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Value("${app.razorpay.webhook-secret:}")
    private String razorpayWebhookSecret;

    /**
     * Creates a Razorpay order and returns the order ID for frontend payment processing.
     */
    @Transactional
    public Map<String, Object> createRazorpayOrder(Long orderId, Long userId) {
        com.marketplace.entity.Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment has already been processed for this order");
        }

        boolean isMockMode = (razorpayKeyId == null || razorpayKeyId.isEmpty() ||
                             razorpayKeyId.equals("rzp_test_PLACEHOLDER") ||
                             razorpayKeyId.equals("rzp_test_CHANGE_ME") ||
                             razorpayKeySecret == null || razorpayKeySecret.isEmpty() ||
                             razorpayKeySecret.equals("your_razorpay_secret") ||
                             razorpayKeySecret.equals("CHANGE_ME"));

        long amountInPaise = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        if (isMockMode) {
            log.info("Razorpay not configured. Generating dummy mock order for orderId={}", orderId);
            String mockOrderId = "order_mock_" + System.currentTimeMillis();

            Payment payment = new Payment();
            payment.setUser(userRepository.findById(userId).orElseThrow());
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setCurrency("INR");
            payment.setPaymentMethod(PaymentMethod.RAZORPAY);
            payment.setRazorpayOrderId(mockOrderId);
            payment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("razorpayOrderId", mockOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("keyId", "rzp_test_MOCK_KEY");
            response.put("orderId", orderId);
            response.put("orderNumber", order.getOrderNumber());
            return response;
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + orderId);
            orderRequest.put("notes", new JSONObject()
                    .put("order_id", orderId)
                    .put("user_id", userId));

            Order razorpayOrder = client.orders.create(orderRequest);

            // Save payment record
            Payment payment = new Payment();
            payment.setUser(userRepository.findById(userId).orElseThrow());
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setCurrency("INR");
            payment.setPaymentMethod(PaymentMethod.RAZORPAY);
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            payment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("razorpayOrderId", razorpayOrder.get("id"));
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            response.put("orderId", orderId);
            response.put("orderNumber", order.getOrderNumber());

            return response;

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for orderId={}: {}", orderId, e.getMessage());
            throw new PaymentException("Failed to initiate payment. Please try again.", e);
        }
    }

    /**
     * Verifies Razorpay payment signature and updates order/payment status.
     */
    @Transactional
    public boolean verifyAndCapturePayment(String razorpayOrderId, String razorpayPaymentId, String signature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + razorpayOrderId));

        boolean isMockMode = (razorpayKeyId == null || razorpayKeyId.isEmpty() ||
                             razorpayKeyId.equals("rzp_test_PLACEHOLDER") ||
                             razorpayKeyId.equals("rzp_test_CHANGE_ME") ||
                             razorpayOrderId.startsWith("order_mock_"));

        if (!isMockMode) {
            // Verify signature
            String signatureData = razorpayOrderId + "|" + razorpayPaymentId;
            if (!verifySignature(signatureData, signature, razorpayKeySecret)) {
                log.warn("Invalid Razorpay signature for orderId: {}", razorpayOrderId);
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
                return false;
            }
        } else {
            log.info("Bypassing Razorpay signature verification in Mock Payment Mode for orderId: {}", razorpayOrderId);
        }

        // Update payment
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus(PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        // Update order payment status
        if (payment.getOrder() != null) {
            com.marketplace.entity.Order order = payment.getOrder();
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            orderRepository.save(order);

            notificationService.sendPaymentNotification(order.getUser(),
                    order.getTotalAmount().toString(), "SUCCESSFUL");
        }

        log.info("Payment verified and captured successfully: paymentId={}", razorpayPaymentId);
        return true;
    }

    /**
     * Verifies Razorpay webhook signature.
     */
    public boolean verifyWebhookSignature(String payload, String webhookSignature) {
        return verifySignature(payload, webhookSignature, razorpayWebhookSecret);
    }

    private boolean verifySignature(String data, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = Hex.encodeHexString(hash);
            return generatedSignature.equalsIgnoreCase(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }
}
