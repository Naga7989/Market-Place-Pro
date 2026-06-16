package com.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main entry point for the Marketplace Backend Application.
 * An enterprise-grade multi-vendor marketplace platform built for India.
 *
 * Features:
 * - Multi-vendor product marketplace
 * - On-demand service bookings
 * - Freelancer project marketplace
 * - Razorpay payment integration (INR)
 * - Google Gemini AI chatbot & recommendations
 * - Real-time notifications via WebSocket
 * - Twilio OTP for phone verification
 * - AWS S3 file storage
 * - Redis caching & Elasticsearch search
 *
 * @author Marketplace Engineering Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableCaching
@EnableJpaAuditing
public class MarketplaceApplication {

    public static void main(String[] args) {
        // Set default timezone to IST for India-first operations
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(MarketplaceApplication.class, args);
    }
}
