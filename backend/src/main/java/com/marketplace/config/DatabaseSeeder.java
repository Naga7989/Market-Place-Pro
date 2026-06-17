package com.marketplace.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder {

    private final DataSource dataSource;

    @EventListener(ApplicationReadyEvent.class)
    public void seedDatabase() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            // Check if database is seeded by verifying if SUPER_ADMIN role exists
            boolean hasRoles = false;
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM roles WHERE name = 'SUPER_ADMIN'")) {
                if (rs.next() && rs.getInt(1) > 0) {
                    hasRoles = true;
                }
            }
            
            if (!hasRoles) {
                log.info("SUPER_ADMIN role not found. Initializing database seeding...");
                
                // Execute schema fixes to add default timestamp values before seeding
                alterTablesToSetTimestampDefaults(stmt);
                
                // Load database seed script from classpath
                org.springframework.core.io.ClassPathResource resource = new org.springframework.core.io.ClassPathResource("db/V2__seed_data.sql");
                if (!resource.exists()) {
                    log.error("Database seed SQL file not found in classpath (db/V2__seed_data.sql)!");
                    return;
                }
                
                log.info("Loading database seed script from classpath: {}", resource.getPath());
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                populator.setContinueOnError(true);
                populator.addScript(resource);
                populator.execute(dataSource);
                log.info("Database seed script executed successfully!");
            } else {
                log.info("Database already populated (found SUPER_ADMIN role). Skipping seeding.");
            }

            // Force reset superadmin password hash to correct BCrypt hash to ensure login succeeds
            String superAdminEmail = "superadmin@bazaarindia.in";
            String correctHash = "$2a$12$PYUcZNbwKuuwdOFU2J2NBOu1Gk/kFBv.pL3WpgBbx6GNK/2gnBe/.";
            int updatedRows = stmt.executeUpdate("UPDATE users SET password_hash = '" + correctHash + "' WHERE email = '" + superAdminEmail + "'");
            if (updatedRows > 0) {
                log.info("Successfully verified and updated superadmin password hash to: {}", correctHash);
            } else {
                log.warn("Superadmin user with email '{}' was not found in the database.", superAdminEmail);
            }

            // Ensure SELLER role exists in the database with identical permissions to VENDOR
            try {
                stmt.executeUpdate("INSERT INTO roles (name, description) VALUES ('SELLER', 'Sells physical or digital products on the marketplace') " +
                        "ON DUPLICATE KEY UPDATE description = VALUES(description)");
                
                stmt.executeUpdate("INSERT INTO role_permissions (role_id, permission_id) " +
                        "SELECT (SELECT id FROM roles WHERE name = 'SELLER'), p.id " +
                        "FROM permissions p " +
                        "WHERE p.resource = 'products' AND p.action IN ('READ','CREATE','UPDATE') " +
                        "   OR (p.resource = 'orders' AND p.action = 'READ') " +
                        "   OR (p.resource = 'coupons' AND p.action = 'MANAGE') " +
                        "ON DUPLICATE KEY UPDATE role_id = role_id");
                log.info("Successfully initialized/verified SELLER role permissions.");
            } catch (Exception e) {
                log.warn("Failed to initialize/verify SELLER role permissions: {}", e.getMessage());
            }

            // Also ensure admin@marketplace.in exists and matches QUICKSTART.md
            String adminEmail = "admin@marketplace.in";
            try (ResultSet rs = stmt.executeQuery("SELECT id FROM users WHERE email = '" + adminEmail + "'")) {
                if (!rs.next()) {
                    log.info("Creating admin@marketplace.in user as Super Admin...");
                    stmt.executeUpdate("INSERT INTO users (email, phone, password_hash, full_name, is_email_verified, is_phone_verified, is_active) " +
                            "VALUES ('" + adminEmail + "', '+919000000002', '" + correctHash + "', 'Super Administrator', 1, 1, 1)");
                } else {
                    log.info("Updating admin@marketplace.in password hash to: {}", correctHash);
                    stmt.executeUpdate("UPDATE users SET password_hash = '" + correctHash + "' WHERE email = '" + adminEmail + "'");
                }
            }

            // Ensure role mapping exists for admin@marketplace.in
            stmt.executeUpdate("INSERT INTO user_roles (user_id, role_id) " +
                    "SELECT u.id, r.id FROM users u, roles r " +
                    "WHERE u.email = '" + adminEmail + "' AND r.name = 'SUPER_ADMIN' " +
                    "AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id)");

            // Ensure wallet exists for admin@marketplace.in
            stmt.executeUpdate("INSERT INTO wallets (user_id, balance, locked_balance, currency, is_active) " +
                    "SELECT u.id, 0.00, 0.00, 'INR', 1 FROM users u " +
                    "WHERE u.email = '" + adminEmail + "' " +
                    "AND NOT EXISTS (SELECT 1 FROM wallets w WHERE w.user_id = u.id)");

            // Ensure loyalty points exist for admin@marketplace.in
            stmt.executeUpdate("INSERT INTO loyalty_points (user_id, points, total_earned, total_redeemed) " +
                    "SELECT u.id, 0, 0, 0 FROM users u " +
                    "WHERE u.email = '" + adminEmail + "' " +
                    "AND NOT EXISTS (SELECT 1 FROM loyalty_points lp WHERE lp.user_id = u.id)");
            
            log.info("Successfully verified/created admin@marketplace.in!");

            // Ensure a default seller/vendor user exists
            String sellerEmail = "seller@marketplace.in";
            Long sellerUserId = null;
            try (ResultSet rs = stmt.executeQuery("SELECT id FROM users WHERE email = '" + sellerEmail + "'")) {
                if (rs.next()) {
                    sellerUserId = rs.getLong(1);
                    // Update password hash just in case
                    stmt.executeUpdate("UPDATE users SET password_hash = '" + correctHash + "' WHERE email = '" + sellerEmail + "'");
                } else {
                    log.info("Creating default seller user...");
                    stmt.executeUpdate("INSERT INTO users (email, phone, password_hash, full_name, is_email_verified, is_phone_verified, is_active) " +
                            "VALUES ('" + sellerEmail + "', '+919000000003', '" + correctHash + "', 'Default Seller', 1, 1, 1)");
                    try (ResultSet rsNew = stmt.executeQuery("SELECT LAST_INSERT_ID()")) {
                        if (rsNew.next()) {
                            sellerUserId = rsNew.getLong(1);
                        }
                    }
                }
            }

            if (sellerUserId != null) {
                // Ensure user has SELLER role
                stmt.executeUpdate("INSERT INTO user_roles (user_id, role_id) " +
                        "SELECT " + sellerUserId + ", id FROM roles WHERE name = 'SELLER' " +
                        "AND NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = " + sellerUserId + ")");

                // Ensure vendor profile exists
                Long vendorId = null;
                try (ResultSet rs = stmt.executeQuery("SELECT id FROM vendors WHERE user_id = " + sellerUserId)) {
                    if (rs.next()) {
                        vendorId = rs.getLong(1);
                    } else {
                        log.info("Creating default vendor profile...");
                        stmt.executeUpdate("INSERT INTO vendors (user_id, business_name, status, is_verified, rating, total_reviews, total_sales, created_at, updated_at) " +
                                "VALUES (" + sellerUserId + ", 'BharatMart Sellers', 'APPROVED', 1, 4.5, 0, 0, NOW(), NOW())");
                        try (ResultSet rsNew = stmt.executeQuery("SELECT LAST_INSERT_ID()")) {
                            if (rsNew.next()) {
                                vendorId = rsNew.getLong(1);
                            }
                        }
                    }
                }

                if (vendorId != null) {
                    // Ensure store profile exists
                    Long storeId = null;
                    try (ResultSet rs = stmt.executeQuery("SELECT id FROM stores WHERE vendor_id = " + vendorId)) {
                        if (rs.next()) {
                            storeId = rs.getLong(1);
                        } else {
                            log.info("Creating default store profile...");
                            stmt.executeUpdate("INSERT INTO stores (vendor_id, name, slug, description, is_active, total_reviews, rating, created_at, updated_at) " +
                                    "VALUES (" + vendorId + ", 'BharatMart Megastore', 'bharatmart-megastore', 'The best online megastore for all categories.', 1, 0, 0.00, NOW(), NOW())");
                            try (ResultSet rsNew = stmt.executeQuery("SELECT LAST_INSERT_ID()")) {
                                if (rsNew.next()) {
                                    storeId = rsNew.getLong(1);
                                }
                            }
                        }
                    }

                    if (storeId != null) {
                        // Check if we need to purge and re-seed (e.g. if "iPhone 15 Pro Max" is missing)
                        boolean needsPurgeAndReseed = true;
                        try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM products WHERE name = 'iPhone 15 Pro Max'")) {
                            if (rs.next() && rs.getInt(1) > 0) {
                                needsPurgeAndReseed = false;
                            }
                        }

                        if (needsPurgeAndReseed) {
                            log.info("Purging old seeded products to refresh catalog with realistic items...");
                            stmt.executeUpdate("DELETE FROM inventory");
                            stmt.executeUpdate("DELETE FROM product_images");
                            stmt.executeUpdate("DELETE FROM product_variants");
                            stmt.executeUpdate("DELETE FROM product_specifications");
                            stmt.executeUpdate("DELETE FROM product_tags");
                            stmt.executeUpdate("DELETE FROM products");
                        }

                        log.info("Checking categories for missing products...");
                        
                        // Get the list of all category ids and slugs
                        java.util.List<Object[]> categoriesList = new java.util.ArrayList<>();
                        try (ResultSet rs = stmt.executeQuery("SELECT id, name, slug FROM categories")) {
                            while (rs.next()) {
                                categoriesList.add(new Object[]{rs.getLong(1), rs.getString(2), rs.getString(3)});
                            }
                        }

                        for (Object[] cat : categoriesList) {
                            Long catId = (Long) cat[0];
                            String catName = (String) cat[1];
                            String catSlug = (String) cat[2];

                            // Check if this category has any products
                            boolean hasProducts = false;
                            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM products WHERE category_id = " + catId)) {
                                if (rs.next() && rs.getInt(1) > 0) {
                                    hasProducts = true;
                                }
                            }

                            if (!hasProducts) {
                                log.info("Category '{}' is empty. Seeding mock products...", catName);
                                
                                String p1Name, p1Slug, p1Sku, p1Desc, p1Image;
                                double p1Base, p1Sale, p1Disc, p1Rating;
                                int p1Reviews, p1Featured;

                                String p2Name, p2Slug, p2Sku, p2Desc, p2Image;
                                double p2Base, p2Sale, p2Disc, p2Rating;
                                int p2Reviews, p2Featured;

                                if ("electronics-mobiles".equals(catSlug)) {
                                    p1Name = "iPhone 15 Pro Max";
                                    p1Slug = "iphone-15-pro-max";
                                    p1Sku = "IPH15PM-001";
                                    p1Desc = "Experience the ultimate iPhone with a titanium design, ground-breaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.";
                                    p1Base = 159900.00; p1Sale = 134900.00; p1Disc = 16.00; p1Rating = 4.80; p1Reviews = 2341; p1Featured = 1;
                                    p1Image = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80";

                                    p2Name = "Samsung Galaxy S24 Ultra";
                                    p2Slug = "samsung-galaxy-s24-ultra";
                                    p2Sku = "SAMS24U-001";
                                    p2Desc = "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.";
                                    p2Base = 139999.00; p2Sale = 129999.00; p2Disc = 7.00; p2Rating = 4.70; p2Reviews = 1205; p2Featured = 0;
                                    p2Image = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80";
                                } else if ("electronics-laptops".equals(catSlug)) {
                                    p1Name = "MacBook Air M3";
                                    p1Slug = "macbook-air-m3";
                                    p1Sku = "MACM3-001";
                                    p1Desc = "The M3 chip brings even greater capabilities to the super-portable 13-inch MacBook Air. With up to 18 hours of battery life, you can take it anywhere.";
                                    p1Base = 124900.00; p1Sale = 114900.00; p1Disc = 8.00; p1Rating = 4.90; p1Reviews = 3211; p1Featured = 1;
                                    p1Image = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80";

                                    p2Name = "Keychron K2 Mechanical Keyboard";
                                    p2Slug = "keychron-k2";
                                    p2Sku = "KEYK2-001";
                                    p2Desc = "Keychron K2 is a tactile wireless mechanical keyboard with Mac and Windows layout compatibility, and convenient access to all the essential multimedia keys.";
                                    p2Base = 8999.00; p2Sale = 7499.00; p2Disc = 16.00; p2Rating = 4.70; p2Reviews = 890; p2Featured = 0;
                                    p2Image = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80";
                                } else if ("electronics-tv".equals(catSlug)) {
                                    p1Name = "Samsung 4K Smart TV 55\"";
                                    p1Slug = "samsung-4k-smart-tv-55";
                                    p1Sku = "SAM55TV-001";
                                    p1Desc = "Experience vivid color and stunning detail with Crystal Processor 4K. Smart TV features let you stream all your favorite content easily.";
                                    p1Base = 79990.00; p1Sale = 49990.00; p1Disc = 38.00; p1Rating = 4.60; p1Reviews = 1205; p1Featured = 1;
                                    p1Image = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80";

                                    p2Name = "Dyson V15 Detect";
                                    p2Slug = "dyson-v15-detect";
                                    p2Sku = "DYSV15-001";
                                    p2Desc = "Dyson's most powerful, intelligent cordless vacuum. With laser illumination and piezo sensor tech to reveal and size microscopic dust particles.";
                                    p2Base = 65900.00; p2Sale = 52900.00; p2Disc = 20.00; p2Rating = 4.90; p2Reviews = 543; p2Featured = 1;
                                    p2Image = "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80";
                                } else if ("electronics-audio".equals(catSlug)) {
                                    p1Name = "Sony WH-1000XM5";
                                    p1Slug = "sony-wh-1000xm5";
                                    p1Sku = "SONXM5-001";
                                    p1Desc = "Sony's industry-leading noise canceling headphones with multiple microphone noise canceling, auto-optimization, and exceptional call quality.";
                                    p1Base = 34990.00; p1Sale = 24990.00; p1Disc = 29.00; p1Rating = 4.80; p1Reviews = 1876; p1Featured = 1;
                                    p1Image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

                                    p2Name = "Logitech MX Master 3S Mouse";
                                    p2Slug = "logitech-mx-master-3s";
                                    p2Sku = "LOGMX3S-001";
                                    p2Desc = "An iconic ergonomic mouse remastered. With Quiet Clicks and 8K DPI any-surface tracking for speed, precision, and silent productivity.";
                                    p2Base = 10995.00; p2Sale = 9495.00; p2Disc = 13.00; p2Rating = 4.80; p2Reviews = 1240; p2Featured = 0;
                                    p2Image = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80";
                                } else if ("fashion-footwear".equals(catSlug)) {
                                    p1Name = "Nike Air Max 2024";
                                    p1Slug = "nike-air-max-2024";
                                    p1Sku = "NIKAM24-001";
                                    p1Desc = "A revolutionary Air unit provides maximum cushioning, responsiveness, and stylish comfort for sports and urban lifestyles alike.";
                                    p1Base = 12995.00; p1Sale = 8995.00; p1Disc = 31.00; p1Rating = 4.70; p1Reviews = 897; p1Featured = 1;
                                    p1Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";

                                    p2Name = "Adidas Ultraboost Light";
                                    p2Slug = "adidas-ultraboost-light";
                                    p2Sku = "ADIUB-001";
                                    p2Desc = "Experience epic energy with the Adidas Ultraboost Light, our lightest Ultraboost ever. The secret lies in the new generation Light BOOST midsole.";
                                    p2Base = 18999.00; p2Sale = 14999.00; p2Disc = 21.00; p2Rating = 4.80; p2Reviews = 320; p2Featured = 0;
                                    p2Image = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500";
                                } else {
                                    p1Name = "Premium " + catName + " Item 1";
                                    p1Slug = catSlug + "-item-1-" + catId;
                                    p1Sku = catSlug.toUpperCase().substring(0, Math.min(3, catSlug.length())) + "-" + catId + "-001";
                                    p1Desc = "This is a premium product in the " + catName + " category. Built with high quality materials and modern design.";
                                    p1Base = 1999.00; p1Sale = 1499.00; p1Disc = 25.00; p1Rating = 4.50; p1Reviews = 1; p1Featured = 1;
                                    p1Image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";

                                    p2Name = "Elite " + catName + " Item 2";
                                    p2Slug = catSlug + "-item-2-" + catId;
                                    p2Sku = catSlug.toUpperCase().substring(0, Math.min(3, catSlug.length())) + "-" + catId + "-002";
                                    p2Desc = "Discover the elite " + catName + " experience. High efficiency, durably tested, and user recommended.";
                                    p2Base = 4999.00; p2Sale = 4499.00; p2Disc = 10.00; p2Rating = 4.80; p2Reviews = 1; p2Featured = 0;
                                    p2Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
                                }

                                p1Name = p1Name.replace("'", "''");
                                p1Desc = p1Desc.replace("'", "''");
                                p2Name = p2Name.replace("'", "''");
                                p2Desc = p2Desc.replace("'", "''");

                                stmt.executeUpdate("INSERT INTO products (name, slug, sku, description, short_description, base_price, sale_price, discount_percent, status, product_type, is_featured, is_flash_sale_eligible, category_id, vendor_id, store_id, average_rating, total_reviews, view_count, sales_count, gst_rate, created_at, updated_at) " +
                                        "VALUES ('" + p1Name + "', '" + p1Slug + "', '" + p1Sku + "', '" + p1Desc + "', 'Short description for item 1', " + p1Base + ", " + p1Sale + ", " + p1Disc + ", 'ACTIVE', 'PHYSICAL', " + p1Featured + ", 0, " + catId + ", " + vendorId + ", " + storeId + ", " + p1Rating + ", " + p1Reviews + ", 0, 0, 0.00, NOW(), NOW())");

                                // Get product ID to add dummy inventory
                                Long p1Id = null;
                                try (ResultSet rsNew = stmt.executeQuery("SELECT LAST_INSERT_ID()")) {
                                    if (rsNew.next()) { p1Id = rsNew.getLong(1); }
                                }
                                if (p1Id != null) {
                                    stmt.executeUpdate("INSERT INTO inventory (product_id, quantity, reserved_quantity, low_stock_threshold, updated_at) VALUES (" + p1Id + ", 100, 0, 5, NOW())");
                                    stmt.executeUpdate("INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at) " +
                                            "VALUES (" + p1Id + ", '" + p1Image + "', '" + p1Name + "', 1, 0, NOW())");
                                }

                                stmt.executeUpdate("INSERT INTO products (name, slug, sku, description, short_description, base_price, sale_price, discount_percent, status, product_type, is_featured, is_flash_sale_eligible, category_id, vendor_id, store_id, average_rating, total_reviews, view_count, sales_count, gst_rate, created_at, updated_at) " +
                                        "VALUES ('" + p2Name + "', '" + p2Slug + "', '" + p2Sku + "', '" + p2Desc + "', 'Short description for item 2', " + p2Base + ", " + p2Sale + ", " + p2Disc + ", 'ACTIVE', 'PHYSICAL', " + p2Featured + ", 0, " + catId + ", " + vendorId + ", " + storeId + ", " + p2Rating + ", " + p2Reviews + ", 0, 0, 0.00, NOW(), NOW())");

                                Long p2Id = null;
                                try (ResultSet rsNew = stmt.executeQuery("SELECT LAST_INSERT_ID()")) {
                                    if (rsNew.next()) { p2Id = rsNew.getLong(1); }
                                }
                                if (p2Id != null) {
                                    stmt.executeUpdate("INSERT INTO inventory (product_id, quantity, reserved_quantity, low_stock_threshold, updated_at) VALUES (" + p2Id + ", 50, 0, 5, NOW())");
                                    stmt.executeUpdate("INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at) " +
                                            "VALUES (" + p2Id + ", '" + p2Image + "', '" + p2Name + "', 1, 0, NOW())");
                                }
                            }
                        }
                        log.info("Dynamic category product seeding check complete.");

                    }
                }
            }

        } catch (Exception e) {
            log.error("Failed to seed database", e);
        }
    }

    private void alterTablesToSetTimestampDefaults(Statement stmt) {
        String[] alterQueries = {
            "ALTER TABLE roles MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE roles MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            
            "ALTER TABLE permissions MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE permissions MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            
            "ALTER TABLE categories MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE categories MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            
            "ALTER TABLE service_categories MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE service_categories MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            "ALTER TABLE service_categories MODIFY sort_order INT NOT NULL DEFAULT 0",
            
            "ALTER TABLE settings MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE settings MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            "ALTER TABLE settings MODIFY data_type VARCHAR(20) NOT NULL DEFAULT 'STRING'",
            "ALTER TABLE settings MODIFY is_encrypted bit(1) NOT NULL DEFAULT 0",
            
            "ALTER TABLE users MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE users MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            "ALTER TABLE users MODIFY is_banned bit(1) NOT NULL DEFAULT 0",
            "ALTER TABLE users MODIFY primary_role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER'",
            
            "ALTER TABLE wallets MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE wallets MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            "ALTER TABLE wallets MODIFY total_credited DECIMAL(12,2) NOT NULL DEFAULT 0.00",
            "ALTER TABLE wallets MODIFY total_debited DECIMAL(12,2) NOT NULL DEFAULT 0.00",
            "ALTER TABLE wallets MODIFY currency VARCHAR(3) NOT NULL DEFAULT 'INR'",
            
            "ALTER TABLE loyalty_points MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE loyalty_points MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            "ALTER TABLE loyalty_points MODIFY tier VARCHAR(20) NOT NULL DEFAULT 'BRONZE'",
            
            "ALTER TABLE cms_pages MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE cms_pages MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            "ALTER TABLE cms_pages MODIFY sort_order INT NOT NULL DEFAULT 0",
            
            "ALTER TABLE tags MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            
            "ALTER TABLE vendors MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE vendors MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            
            "ALTER TABLE stores MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE stores MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            
            "ALTER TABLE products MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE products MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            
            "ALTER TABLE product_images MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
        };

        for (String query : alterQueries) {
            try {
                log.info("Executing schema fix: {}", query);
                stmt.executeUpdate(query);
            } catch (Exception e) {
                log.warn("Failed to execute schema fix query: {}. Error: {}", query, e.getMessage());
            }
        }
    }
}
