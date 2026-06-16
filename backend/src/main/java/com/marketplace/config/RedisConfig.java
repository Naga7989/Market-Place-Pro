package com.marketplace.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cache configuration for local development.
 * Uses simple in-memory ConcurrentMap cache — no Redis required.
 * For production, swap this with RedisConfig and enable Redis.
 */
@Configuration
public class RedisConfig {

    @Bean
    public CacheManager cacheManager() {
        // Simple in-memory cache — works without Redis installed
        return new ConcurrentMapCacheManager(
                "products", "categories", "users", "coupons", "settings"
        );
    }
}
