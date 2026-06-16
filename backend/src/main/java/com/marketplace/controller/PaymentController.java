package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@Tag(name = "Payments", description = "Payment processing with Razorpay & UPI")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Create a Razorpay order for payment")
    @PostMapping("/razorpay/create/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createRazorpayOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Map<String, Object> data = paymentService.createRazorpayOrder(orderId, currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Payment order created", data));
    }

    @Operation(summary = "Verify and capture Razorpay payment")
    @PostMapping("/razorpay/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(
            @RequestBody Map<String, String> body) {
        String razorpayOrderId = body.get("razorpay_order_id");
        String razorpayPaymentId = body.get("razorpay_payment_id");
        String signature = body.get("razorpay_signature");

        if (razorpayOrderId == null || razorpayPaymentId == null || signature == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Missing payment verification parameters"));
        }

        boolean verified = paymentService.verifyAndCapturePayment(razorpayOrderId, razorpayPaymentId, signature);
        if (verified) {
            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", true));
        } else {
            return ResponseEntity.status(402).body(ApiResponse.error("Payment verification failed"));
        }
    }

    @Operation(summary = "Razorpay webhook endpoint")
    @PostMapping("/razorpay/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        if (!paymentService.verifyWebhookSignature(payload, signature)) {
            log.warn("Invalid Razorpay webhook signature");
            return ResponseEntity.status(400).body("Invalid signature");
        }
        log.info("Razorpay webhook received");
        // TODO: Handle specific webhook events (payment.captured, payment.failed, etc.)
        return ResponseEntity.ok("OK");
    }
}
