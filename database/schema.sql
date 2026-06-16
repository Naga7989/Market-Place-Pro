-- ============================================================
-- INDIA-FIRST ENTERPRISE MARKETPLACE PLATFORM
-- MySQL 8.0 Complete Database Schema
-- Currency: INR (₹) | Payments: Razorpay + UPI | AI: Google Gemini
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET time_zone = '+05:30';
SET foreign_key_checks = 0;

CREATE DATABASE IF NOT EXISTS marketplace_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE marketplace_db;

-- ============================================================
-- SECTION 1: AUTH & USER MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)     NOT NULL,
  phone         VARCHAR(15)      NOT NULL,
  password_hash VARCHAR(255)     NOT NULL,
  full_name     VARCHAR(150)     NOT NULL,
  avatar_url    VARCHAR(500)     NULL,
  is_email_verified TINYINT(1)   NOT NULL DEFAULT 0,
  is_phone_verified TINYINT(1)   NOT NULL DEFAULT 0,
  is_active     TINYINT(1)       NOT NULL DEFAULT 1,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email  (email),
  UNIQUE KEY uq_users_phone  (phone),
  INDEX idx_users_is_active  (is_active),
  INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(60)   NOT NULL,
  description VARCHAR(255)  NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name     VARCHAR(100) NOT NULL,
  resource VARCHAR(80)  NOT NULL,
  action   VARCHAR(40)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_resource_action (resource, action),
  INDEX idx_permissions_resource (resource)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id INT UNSIGNED    NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES roles       (id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  token      VARCHAR(512)    NOT NULL,
  expires_at DATETIME        NOT NULL,
  is_revoked TINYINT(1)      NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_tokens_token (token(255)),
  INDEX idx_rt_user_id    (user_id),
  INDEX idx_rt_expires_at (expires_at),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS otp_verifications (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NULL,
  phone      VARCHAR(15)     NULL,
  email      VARCHAR(255)    NULL,
  otp_code   VARCHAR(8)      NOT NULL,
  purpose    ENUM('REGISTRATION','LOGIN','PASSWORD_RESET','PHONE_VERIFY') NOT NULL,
  expires_at DATETIME        NOT NULL,
  is_used    TINYINT(1)      NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_otp_user_id    (user_id),
  INDEX idx_otp_phone      (phone),
  INDEX idx_otp_email      (email),
  INDEX idx_otp_expires_at (expires_at),
  CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id               BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED  NOT NULL,
  provider         ENUM('GOOGLE','FACEBOOK') NOT NULL,
  provider_user_id VARCHAR(255)     NOT NULL,
  access_token     TEXT             NULL,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_oauth_provider_uid (provider, provider_user_id),
  INDEX idx_oauth_user_id (user_id),
  CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 2: ADDRESSES
-- ============================================================

CREATE TABLE IF NOT EXISTS addresses (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED  NOT NULL,
  label         VARCHAR(50)      NOT NULL DEFAULT 'Home',
  full_name     VARCHAR(150)     NOT NULL,
  phone         VARCHAR(15)      NOT NULL,
  address_line1 VARCHAR(255)     NOT NULL,
  address_line2 VARCHAR(255)     NULL,
  city          VARCHAR(100)     NOT NULL,
  state         VARCHAR(100)     NOT NULL,
  pincode       VARCHAR(10)      NOT NULL,
  country       VARCHAR(60)      NOT NULL DEFAULT 'India',
  latitude      DECIMAL(10,8)    NULL,
  longitude     DECIMAL(11,8)    NULL,
  is_default    TINYINT(1)       NOT NULL DEFAULT 0,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_addresses_user_id  (user_id),
  INDEX idx_addresses_pincode  (pincode),
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 3: CATEGORIES & TAGS
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  parent_id   INT UNSIGNED  NULL,
  name        VARCHAR(150)  NOT NULL,
  slug        VARCHAR(170)  NOT NULL,
  description TEXT          NULL,
  image_url   VARCHAR(500)  NULL,
  icon        VARCHAR(100)  NULL,
  level       TINYINT       NOT NULL DEFAULT 1,
  sort_order  INT           NOT NULL DEFAULT 0,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug),
  INDEX idx_categories_parent_id (parent_id),
  INDEX idx_categories_level     (level),
  INDEX idx_categories_is_active (is_active),
  CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tags (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80)  NOT NULL,
  slug VARCHAR(90)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tags_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 4: VENDORS & STORES
-- ============================================================

CREATE TABLE IF NOT EXISTS vendors (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id             BIGINT UNSIGNED NOT NULL,
  business_name       VARCHAR(200)    NOT NULL,
  business_type       ENUM('INDIVIDUAL','PARTNERSHIP','PRIVATE_LIMITED','LLP') NOT NULL DEFAULT 'INDIVIDUAL',
  gst_number          VARCHAR(20)     NULL,
  pan_number          VARCHAR(15)     NULL,
  bank_account_number VARCHAR(30)     NULL,
  bank_ifsc           VARCHAR(15)     NULL,
  bank_name           VARCHAR(100)    NULL,
  status              ENUM('PENDING','UNDER_REVIEW','APPROVED','SUSPENDED','REJECTED') NOT NULL DEFAULT 'PENDING',
  commission_rate     DECIMAL(5,2)    NOT NULL DEFAULT 10.00,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vendors_user_id (user_id),
  INDEX idx_vendors_status (status),
  CONSTRAINT fk_vendor_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vendor_documents (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id     BIGINT UNSIGNED NOT NULL,
  document_type ENUM('GST_CERTIFICATE','PAN_CARD','AADHAAR','BUSINESS_REGISTRATION','BANK_STATEMENT') NOT NULL,
  document_url  VARCHAR(500)    NOT NULL,
  verified_at   DATETIME        NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_vd_vendor_id (vendor_id),
  CONSTRAINT fk_vd_vendor FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stores (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id     BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(200)    NOT NULL,
  slug          VARCHAR(220)    NOT NULL,
  description   TEXT            NULL,
  logo_url      VARCHAR(500)    NULL,
  banner_url    VARCHAR(500)    NULL,
  rating        DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  total_reviews INT             NOT NULL DEFAULT 0,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_stores_slug (slug),
  INDEX idx_stores_vendor_id (vendor_id),
  INDEX idx_stores_is_active (is_active),
  CONSTRAINT fk_store_vendor FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 5: PRODUCTS & INVENTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id         BIGINT UNSIGNED NOT NULL,
  store_id          BIGINT UNSIGNED NOT NULL,
  category_id       INT UNSIGNED    NOT NULL,
  name              VARCHAR(300)    NOT NULL,
  slug              VARCHAR(320)    NOT NULL,
  description       LONGTEXT        NULL,
  short_description VARCHAR(500)    NULL,
  sku               VARCHAR(100)    NOT NULL,
  base_price        DECIMAL(12,2)   NOT NULL,
  selling_price     DECIMAL(12,2)   NOT NULL,
  discount_percent  DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
  product_type      ENUM('PHYSICAL','DIGITAL','SERVICE') NOT NULL DEFAULT 'PHYSICAL',
  status            ENUM('DRAFT','ACTIVE','INACTIVE','OUT_OF_STOCK') NOT NULL DEFAULT 'DRAFT',
  is_featured       TINYINT(1)      NOT NULL DEFAULT 0,
  is_best_seller    TINYINT(1)      NOT NULL DEFAULT 0,
  weight            DECIMAL(10,3)   NULL COMMENT 'Weight in kg',
  dimensions_json   JSON            NULL COMMENT '{"length": 10, "width": 5, "height": 3, "unit": "cm"}',
  shipping_class    VARCHAR(50)     NULL,
  meta_title        VARCHAR(200)    NULL,
  meta_description  VARCHAR(400)    NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug     (slug),
  UNIQUE KEY uq_products_sku      (vendor_id, sku),
  INDEX idx_products_vendor_id    (vendor_id),
  INDEX idx_products_store_id     (store_id),
  INDEX idx_products_category_id  (category_id),
  INDEX idx_products_status       (status),
  INDEX idx_products_is_featured  (is_featured),
  INDEX idx_products_selling_price(selling_price),
  FULLTEXT idx_products_fulltext  (name, short_description),
  CONSTRAINT fk_prod_vendor   FOREIGN KEY (vendor_id)   REFERENCES vendors    (id) ON DELETE CASCADE,
  CONSTRAINT fk_prod_store    FOREIGN KEY (store_id)    REFERENCES stores     (id) ON DELETE CASCADE,
  CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  image_url  VARCHAR(500)    NOT NULL,
  alt_text   VARCHAR(200)    NULL,
  sort_order INT             NOT NULL DEFAULT 0,
  is_primary TINYINT(1)      NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_pi_product_id (product_id),
  CONSTRAINT fk_pi_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_videos (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    BIGINT UNSIGNED NOT NULL,
  video_url     VARCHAR(500)    NOT NULL,
  thumbnail_url VARCHAR(500)    NULL,
  title         VARCHAR(200)    NULL,
  PRIMARY KEY (id),
  INDEX idx_pv_product_id (product_id),
  CONSTRAINT fk_pv_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_variants (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id     BIGINT UNSIGNED NOT NULL,
  variant_name   VARCHAR(150)    NOT NULL,
  sku            VARCHAR(100)    NOT NULL,
  price          DECIMAL(12,2)   NOT NULL,
  stock_quantity INT             NOT NULL DEFAULT 0,
  attributes_json JSON           NULL COMMENT '{"color":"Red","size":"XL"}',
  image_url      VARCHAR(500)    NULL,
  is_active      TINYINT(1)      NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pvar_product_sku (product_id, sku),
  INDEX idx_pvar_product_id (product_id),
  CONSTRAINT fk_pvar_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_specifications (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  spec_group VARCHAR(100)    NOT NULL,
  spec_name  VARCHAR(150)    NOT NULL,
  spec_value VARCHAR(500)    NOT NULL,
  sort_order INT             NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_pspec_product_id (product_id),
  CONSTRAINT fk_pspec_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_tags (
  product_id BIGINT UNSIGNED NOT NULL,
  tag_id     INT UNSIGNED    NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  CONSTRAINT fk_ptag_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_ptag_tag     FOREIGN KEY (tag_id)     REFERENCES tags     (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id         BIGINT UNSIGNED NOT NULL,
  variant_id         BIGINT UNSIGNED NULL,
  quantity           INT             NOT NULL DEFAULT 0,
  reserved_quantity  INT             NOT NULL DEFAULT 0,
  warehouse_location VARCHAR(100)    NULL,
  last_updated       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inv_product_variant (product_id, variant_id),
  INDEX idx_inv_product_id (product_id),
  INDEX idx_inv_variant_id (variant_id),
  CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products         (id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_variant FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wishlists (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wish_user_product_variant (user_id, product_id, variant_id),
  INDEX idx_wish_user_id    (user_id),
  INDEX idx_wish_product_id (product_id),
  CONSTRAINT fk_wish_user    FOREIGN KEY (user_id)    REFERENCES users            (id) ON DELETE CASCADE,
  CONSTRAINT fk_wish_product FOREIGN KEY (product_id) REFERENCES products         (id) ON DELETE CASCADE,
  CONSTRAINT fk_wish_variant FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 6: CART
-- ============================================================

CREATE TABLE IF NOT EXISTS carts (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NULL,
  session_id VARCHAR(128)    NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_carts_user_id    (user_id),
  INDEX idx_carts_session_id (session_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cart_items (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cart_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  quantity   INT             NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2)   NOT NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ci_cart_product_variant (cart_id, product_id, variant_id),
  INDEX idx_ci_cart_id    (cart_id),
  INDEX idx_ci_product_id (product_id),
  CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)    REFERENCES carts            (id) ON DELETE CASCADE,
  CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products         (id) ON DELETE CASCADE,
  CONSTRAINT fk_ci_variant FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 7: COUPONS (defined before orders for FK)
-- ============================================================

CREATE TABLE IF NOT EXISTS coupons (
  id               BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  vendor_id        BIGINT UNSIGNED  NULL,
  code             VARCHAR(20)      NOT NULL,
  name             VARCHAR(150)     NOT NULL,
  description      VARCHAR(500)     NULL,
  discount_type    ENUM('PERCENT','FLAT','FREE_SHIPPING') NOT NULL DEFAULT 'PERCENT',
  discount_value   DECIMAL(10,2)    NOT NULL,
  min_order_amount DECIMAL(12,2)    NOT NULL DEFAULT 0.00,
  max_discount     DECIMAL(12,2)    NULL,
  usage_limit      INT              NULL,
  used_count       INT              NOT NULL DEFAULT 0,
  valid_from       DATETIME         NOT NULL,
  valid_until      DATETIME         NOT NULL,
  is_active        TINYINT(1)       NOT NULL DEFAULT 1,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coupons_code (code),
  INDEX idx_coupons_vendor_id   (vendor_id),
  INDEX idx_coupons_valid_from  (valid_from),
  INDEX idx_coupons_valid_until (valid_until),
  INDEX idx_coupons_is_active   (is_active),
  CONSTRAINT fk_coupon_vendor FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 8: ORDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NOT NULL,
  order_number     VARCHAR(20)     NOT NULL,
  status           ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  payment_status   ENUM('PENDING','PAID','PARTIALLY_PAID','REFUNDED','FAILED') NOT NULL DEFAULT 'PENDING',
  subtotal         DECIMAL(12,2)   NOT NULL,
  discount_amount  DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  delivery_charge  DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  gst_amount       DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  total_amount     DECIMAL(12,2)   NOT NULL,
  address_id       BIGINT UNSIGNED NOT NULL,
  coupon_id        BIGINT UNSIGNED NULL,
  notes            TEXT            NULL,
  estimated_delivery DATE          NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_order_number (order_number),
  INDEX idx_orders_user_id        (user_id),
  INDEX idx_orders_status         (status),
  INDEX idx_orders_payment_status (payment_status),
  INDEX idx_orders_address_id     (address_id),
  INDEX idx_orders_coupon_id      (coupon_id),
  INDEX idx_orders_created_at     (created_at),
  CONSTRAINT fk_order_user    FOREIGN KEY (user_id)   REFERENCES users     (id) ON DELETE RESTRICT,
  CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES addresses (id) ON DELETE RESTRICT,
  CONSTRAINT fk_order_coupon  FOREIGN KEY (coupon_id)  REFERENCES coupons   (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id          BIGINT UNSIGNED NOT NULL,
  product_id        BIGINT UNSIGNED NOT NULL,
  variant_id        BIGINT UNSIGNED NULL,
  vendor_id         BIGINT UNSIGNED NOT NULL,
  quantity          INT             NOT NULL,
  unit_price        DECIMAL(12,2)   NOT NULL,
  total_price       DECIMAL(12,2)   NOT NULL,
  status            ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED','RETURNED') NOT NULL DEFAULT 'PENDING',
  commission_amount DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  INDEX idx_oi_order_id   (order_id),
  INDEX idx_oi_product_id (product_id),
  INDEX idx_oi_vendor_id  (vendor_id),
  INDEX idx_oi_status     (status),
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders           (id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products         (id) ON DELETE RESTRICT,
  CONSTRAINT fk_oi_variant FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE SET NULL,
  CONSTRAINT fk_oi_vendor  FOREIGN KEY (vendor_id)  REFERENCES vendors          (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_tracking (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id    BIGINT UNSIGNED NOT NULL,
  status      VARCHAR(80)     NOT NULL,
  location    VARCHAR(200)    NULL,
  description VARCHAR(500)    NULL,
  timestamp   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_ot_order_id  (order_id),
  INDEX idx_ot_timestamp (timestamp),
  CONSTRAINT fk_ot_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS returns (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id       BIGINT UNSIGNED NOT NULL,
  order_item_id  BIGINT UNSIGNED NOT NULL,
  user_id        BIGINT UNSIGNED NOT NULL,
  reason         TEXT            NOT NULL,
  status         ENUM('REQUESTED','APPROVED','PICKED_UP','REFUNDED','REJECTED') NOT NULL DEFAULT 'REQUESTED',
  refund_amount  DECIMAL(12,2)   NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_ret_order_id      (order_id),
  INDEX idx_ret_order_item_id (order_item_id),
  INDEX idx_ret_user_id       (user_id),
  INDEX idx_ret_status        (status),
  CONSTRAINT fk_ret_order      FOREIGN KEY (order_id)      REFERENCES orders      (id) ON DELETE CASCADE,
  CONSTRAINT fk_ret_order_item FOREIGN KEY (order_item_id) REFERENCES order_items (id) ON DELETE CASCADE,
  CONSTRAINT fk_ret_user       FOREIGN KEY (user_id)       REFERENCES users        (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refunds (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id           BIGINT UNSIGNED NOT NULL,
  payment_id         BIGINT UNSIGNED NULL,
  amount             DECIMAL(12,2)   NOT NULL,
  reason             TEXT            NULL,
  status             ENUM('PENDING','PROCESSED','FAILED') NOT NULL DEFAULT 'PENDING',
  processed_at       DATETIME        NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_refund_order_id   (order_id),
  INDEX idx_refund_payment_id (payment_id),
  INDEX idx_refund_status     (status),
  CONSTRAINT fk_refund_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 9: SERVICE MARKETPLACE
-- ============================================================

CREATE TABLE IF NOT EXISTS service_categories (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id   INT UNSIGNED NULL,
  name        VARCHAR(150) NOT NULL,
  slug        VARCHAR(170) NOT NULL,
  description TEXT         NULL,
  icon        VARCHAR(100) NULL,
  image_url   VARCHAR(500) NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sc_slug (slug),
  INDEX idx_sc_parent_id (parent_id),
  CONSTRAINT fk_sc_parent FOREIGN KEY (parent_id) REFERENCES service_categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_providers (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id             BIGINT UNSIGNED NOT NULL,
  business_name       VARCHAR(200)    NOT NULL,
  description         TEXT            NULL,
  experience_years    INT             NOT NULL DEFAULT 0,
  service_area_pincodes JSON          NULL COMMENT '["400001","400002"]',
  portfolio_urls      JSON            NULL,
  status              ENUM('PENDING','APPROVED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  rating              DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  total_jobs          INT             NOT NULL DEFAULT 0,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sp_user_id (user_id),
  INDEX idx_sp_status (status),
  CONSTRAINT fk_sp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider_id      BIGINT UNSIGNED NOT NULL,
  category_id      INT UNSIGNED    NOT NULL,
  name             VARCHAR(200)    NOT NULL,
  slug             VARCHAR(220)    NOT NULL,
  description      TEXT            NULL,
  base_price       DECIMAL(12,2)   NOT NULL,
  price_type       ENUM('FIXED','HOURLY','QUOTE') NOT NULL DEFAULT 'FIXED',
  duration_minutes INT             NULL,
  is_available     TINYINT(1)      NOT NULL DEFAULT 1,
  rating           DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  total_reviews    INT             NOT NULL DEFAULT 0,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_svc_slug (slug),
  INDEX idx_svc_provider_id  (provider_id),
  INDEX idx_svc_category_id  (category_id),
  INDEX idx_svc_is_available (is_available),
  CONSTRAINT fk_svc_provider FOREIGN KEY (provider_id) REFERENCES service_providers (id) ON DELETE CASCADE,
  CONSTRAINT fk_svc_category FOREIGN KEY (category_id) REFERENCES service_categories (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_availability (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider_id BIGINT UNSIGNED NOT NULL,
  day_of_week TINYINT      NOT NULL COMMENT '0=Sunday, 1=Monday ... 6=Saturday',
  start_time  TIME         NOT NULL,
  end_time    TIME         NOT NULL,
  is_available TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sa_provider_day (provider_id, day_of_week),
  INDEX idx_sa_provider_id (provider_id),
  CONSTRAINT fk_sa_provider FOREIGN KEY (provider_id) REFERENCES service_providers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS time_slots (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider_id BIGINT UNSIGNED NOT NULL,
  service_id  BIGINT UNSIGNED NOT NULL,
  slot_date   DATE            NOT NULL,
  start_time  TIME            NOT NULL,
  end_time    TIME            NOT NULL,
  is_booked   TINYINT(1)      NOT NULL DEFAULT 0,
  booking_id  BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ts_provider_date_start (provider_id, slot_date, start_time),
  INDEX idx_ts_provider_id (provider_id),
  INDEX idx_ts_service_id  (service_id),
  INDEX idx_ts_slot_date   (slot_date),
  CONSTRAINT fk_ts_provider FOREIGN KEY (provider_id) REFERENCES service_providers (id) ON DELETE CASCADE,
  CONSTRAINT fk_ts_service  FOREIGN KEY (service_id)  REFERENCES services          (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 10: BOOKINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  provider_id    BIGINT UNSIGNED NOT NULL,
  service_id     BIGINT UNSIGNED NOT NULL,
  slot_id        BIGINT UNSIGNED NULL,
  address_id     BIGINT UNSIGNED NOT NULL,
  status         ENUM('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW') NOT NULL DEFAULT 'PENDING',
  scheduled_at   DATETIME        NOT NULL,
  completed_at   DATETIME        NULL,
  total_amount   DECIMAL(12,2)   NOT NULL,
  payment_status ENUM('PENDING','PAID','REFUNDED') NOT NULL DEFAULT 'PENDING',
  notes          TEXT            NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_bk_user_id     (user_id),
  INDEX idx_bk_provider_id (provider_id),
  INDEX idx_bk_service_id  (service_id),
  INDEX idx_bk_status      (status),
  INDEX idx_bk_scheduled   (scheduled_at),
  CONSTRAINT fk_bk_user     FOREIGN KEY (user_id)     REFERENCES users             (id) ON DELETE RESTRICT,
  CONSTRAINT fk_bk_provider FOREIGN KEY (provider_id) REFERENCES service_providers (id) ON DELETE RESTRICT,
  CONSTRAINT fk_bk_service  FOREIGN KEY (service_id)  REFERENCES services          (id) ON DELETE RESTRICT,
  CONSTRAINT fk_bk_slot     FOREIGN KEY (slot_id)     REFERENCES time_slots        (id) ON DELETE SET NULL,
  CONSTRAINT fk_bk_address  FOREIGN KEY (address_id)  REFERENCES addresses         (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_reviews (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id  BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  provider_id BIGINT UNSIGNED NOT NULL,
  rating      TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT            NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_br_booking_user (booking_id, user_id),
  INDEX idx_br_booking_id  (booking_id),
  INDEX idx_br_provider_id (provider_id),
  CONSTRAINT fk_br_booking  FOREIGN KEY (booking_id)  REFERENCES bookings          (id) ON DELETE CASCADE,
  CONSTRAINT fk_br_user     FOREIGN KEY (user_id)     REFERENCES users             (id) ON DELETE CASCADE,
  CONSTRAINT fk_br_provider FOREIGN KEY (provider_id) REFERENCES service_providers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 11: FREELANCER MARKETPLACE
-- ============================================================

CREATE TABLE IF NOT EXISTS freelancers (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NOT NULL,
  bio              TEXT            NULL,
  hourly_rate      DECIMAL(10,2)   NULL,
  skills_json      JSON            NULL,
  portfolio_urls   JSON            NULL,
  resume_url       VARCHAR(500)    NULL,
  linkedin_url     VARCHAR(500)    NULL,
  github_url       VARCHAR(500)    NULL,
  status           ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  rating           DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  total_projects   INT             NOT NULL DEFAULT 0,
  total_earnings   DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_fl_user_id (user_id),
  INDEX idx_fl_status (status),
  INDEX idx_fl_rating (rating),
  CONSTRAINT fk_fl_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS freelancer_skills (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  freelancer_id BIGINT UNSIGNED NOT NULL,
  skill_name    VARCHAR(100)  NOT NULL,
  proficiency   ENUM('BEGINNER','INTERMEDIATE','EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
  PRIMARY KEY (id),
  INDEX idx_fls_freelancer_id (freelancer_id),
  INDEX idx_fls_skill_name    (skill_name),
  CONSTRAINT fk_fls_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id           BIGINT UNSIGNED NOT NULL,
  title               VARCHAR(300)    NOT NULL,
  description         TEXT            NOT NULL,
  budget_min          DECIMAL(12,2)   NOT NULL,
  budget_max          DECIMAL(12,2)   NOT NULL,
  project_type        ENUM('FIXED','HOURLY') NOT NULL DEFAULT 'FIXED',
  skills_required     JSON            NULL,
  deadline            DATE            NULL,
  status              ENUM('OPEN','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'OPEN',
  hired_freelancer_id BIGINT UNSIGNED NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_proj_client_id   (client_id),
  INDEX idx_proj_status      (status),
  INDEX idx_proj_freelancer  (hired_freelancer_id),
  INDEX idx_proj_created_at  (created_at),
  CONSTRAINT fk_proj_client     FOREIGN KEY (client_id)           REFERENCES users       (id) ON DELETE RESTRICT,
  CONSTRAINT fk_proj_freelancer FOREIGN KEY (hired_freelancer_id) REFERENCES freelancers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proposals (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id     BIGINT UNSIGNED NOT NULL,
  freelancer_id  BIGINT UNSIGNED NOT NULL,
  cover_letter   TEXT            NULL,
  bid_amount     DECIMAL(12,2)   NOT NULL,
  timeline_days  INT             NOT NULL,
  status         ENUM('PENDING','SHORTLISTED','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'PENDING',
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_prop_project_freelancer (project_id, freelancer_id),
  INDEX idx_prop_project_id    (project_id),
  INDEX idx_prop_freelancer_id (freelancer_id),
  INDEX idx_prop_status        (status),
  CONSTRAINT fk_prop_project    FOREIGN KEY (project_id)    REFERENCES projects    (id) ON DELETE CASCADE,
  CONSTRAINT fk_prop_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS milestones (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id  BIGINT UNSIGNED NOT NULL,
  proposal_id BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(200)    NOT NULL,
  description TEXT            NULL,
  amount      DECIMAL(12,2)   NOT NULL,
  due_date    DATE            NULL,
  status      ENUM('PENDING','IN_PROGRESS','SUBMITTED','APPROVED','PAID') NOT NULL DEFAULT 'PENDING',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_ms_project_id  (project_id),
  INDEX idx_ms_proposal_id (proposal_id),
  INDEX idx_ms_status      (status),
  CONSTRAINT fk_ms_project  FOREIGN KEY (project_id)  REFERENCES projects  (id) ON DELETE CASCADE,
  CONSTRAINT fk_ms_proposal FOREIGN KEY (proposal_id) REFERENCES proposals (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 12: PAYMENTS & WALLETS
-- ============================================================

CREATE TABLE IF NOT EXISTS wallets (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  balance         DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  locked_balance  DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  currency        VARCHAR(3)      NOT NULL DEFAULT 'INR',
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wallets_user_id (user_id),
  CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id             BIGINT UNSIGNED NOT NULL,
  order_id            BIGINT UNSIGNED NULL,
  booking_id          BIGINT UNSIGNED NULL,
  project_id          BIGINT UNSIGNED NULL,
  amount              DECIMAL(12,2)   NOT NULL,
  currency            VARCHAR(3)      NOT NULL DEFAULT 'INR',
  payment_method      ENUM('RAZORPAY','UPI','CREDIT_CARD','DEBIT_CARD','WALLET','COD','BANK_TRANSFER') NOT NULL,
  razorpay_order_id   VARCHAR(100)    NULL,
  razorpay_payment_id VARCHAR(100)    NULL,
  razorpay_signature  VARCHAR(500)    NULL,
  status              ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  metadata_json       JSON            NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_pay_user_id    (user_id),
  INDEX idx_pay_order_id   (order_id),
  INDEX idx_pay_booking_id (booking_id),
  INDEX idx_pay_project_id (project_id),
  INDEX idx_pay_status     (status),
  INDEX idx_pay_rz_order   (razorpay_order_id),
  CONSTRAINT fk_pay_user    FOREIGN KEY (user_id)    REFERENCES users     (id) ON DELETE RESTRICT,
  CONSTRAINT fk_pay_order   FOREIGN KEY (order_id)   REFERENCES orders    (id) ON DELETE SET NULL,
  CONSTRAINT fk_pay_booking FOREIGN KEY (booking_id) REFERENCES bookings  (id) ON DELETE SET NULL,
  CONSTRAINT fk_pay_project FOREIGN KEY (project_id) REFERENCES projects  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  wallet_id      BIGINT UNSIGNED NOT NULL,
  type           ENUM('CREDIT','DEBIT') NOT NULL,
  amount         DECIMAL(12,2)   NOT NULL,
  balance_after  DECIMAL(12,2)   NOT NULL,
  description    VARCHAR(300)    NULL,
  reference_id   VARCHAR(100)    NULL,
  reference_type VARCHAR(60)     NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_txn_user_id    (user_id),
  INDEX idx_txn_wallet_id  (wallet_id),
  INDEX idx_txn_type       (type),
  INDEX idx_txn_created_at (created_at),
  CONSTRAINT fk_txn_user   FOREIGN KEY (user_id)   REFERENCES users    (id) ON DELETE RESTRICT,
  CONSTRAINT fk_txn_wallet FOREIGN KEY (wallet_id) REFERENCES wallets  (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 13: DELIVERY PARTNERS
-- ============================================================

CREATE TABLE IF NOT EXISTS delivery_partners (
  id               BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED  NOT NULL,
  vehicle_type     ENUM('BIKE','SCOOTER','CAR','VAN') NOT NULL DEFAULT 'BIKE',
  vehicle_number   VARCHAR(20)      NOT NULL,
  license_number   VARCHAR(30)      NOT NULL,
  status           ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'INACTIVE',
  current_latitude DECIMAL(10,8)    NULL,
  current_longitude DECIMAL(11,8)   NULL,
  is_available     TINYINT(1)       NOT NULL DEFAULT 0,
  rating           DECIMAL(3,2)     NOT NULL DEFAULT 0.00,
  total_deliveries INT              NOT NULL DEFAULT 0,
  total_earnings   DECIMAL(12,2)    NOT NULL DEFAULT 0.00,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_dp_user_id (user_id),
  INDEX idx_dp_status       (status),
  INDEX idx_dp_is_available (is_available),
  CONSTRAINT fk_dp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS delivery_assignments (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  partner_id    BIGINT UNSIGNED NOT NULL,
  status        ENUM('ASSIGNED','ACCEPTED','PICKED_UP','IN_TRANSIT','DELIVERED','FAILED') NOT NULL DEFAULT 'ASSIGNED',
  pickup_otp    VARCHAR(6)      NULL,
  delivery_otp  VARCHAR(6)      NULL,
  pickup_time   DATETIME        NULL,
  delivery_time DATETIME        NULL,
  distance_km   DECIMAL(8,2)    NULL,
  earnings      DECIMAL(10,2)   NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_da_order_id   (order_id),
  INDEX idx_da_partner_id (partner_id),
  INDEX idx_da_status     (status),
  CONSTRAINT fk_da_order   FOREIGN KEY (order_id)   REFERENCES orders            (id) ON DELETE CASCADE,
  CONSTRAINT fk_da_partner FOREIGN KEY (partner_id) REFERENCES delivery_partners (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 14: PROMOTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS coupon_usage (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  coupon_id        BIGINT UNSIGNED NOT NULL,
  user_id          BIGINT UNSIGNED NOT NULL,
  order_id         BIGINT UNSIGNED NOT NULL,
  discount_applied DECIMAL(12,2)   NOT NULL,
  used_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cu_coupon_user_order (coupon_id, user_id, order_id),
  INDEX idx_cu_coupon_id (coupon_id),
  INDEX idx_cu_user_id   (user_id),
  INDEX idx_cu_order_id  (order_id),
  CONSTRAINT fk_cu_coupon FOREIGN KEY (coupon_id) REFERENCES coupons (id) ON DELETE CASCADE,
  CONSTRAINT fk_cu_user   FOREIGN KEY (user_id)   REFERENCES users   (id) ON DELETE CASCADE,
  CONSTRAINT fk_cu_order  FOREIGN KEY (order_id)  REFERENCES orders  (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS flash_sales (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(150) NOT NULL,
  start_time DATETIME     NOT NULL,
  end_time   DATETIME     NOT NULL,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  INDEX idx_fs_start_time (start_time),
  INDEX idx_fs_end_time   (end_time),
  INDEX idx_fs_is_active  (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS flash_sale_products (
  flash_sale_id INT UNSIGNED    NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  sale_price    DECIMAL(12,2)   NOT NULL,
  stock_limit   INT             NOT NULL DEFAULT 0,
  sold_count    INT             NOT NULL DEFAULT 0,
  PRIMARY KEY (flash_sale_id, product_id),
  INDEX idx_fsp_product_id (product_id),
  CONSTRAINT fk_fsp_flash_sale FOREIGN KEY (flash_sale_id) REFERENCES flash_sales (id) ON DELETE CASCADE,
  CONSTRAINT fk_fsp_product    FOREIGN KEY (product_id)    REFERENCES products    (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS loyalty_points (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  points         INT             NOT NULL DEFAULT 0,
  total_earned   INT             NOT NULL DEFAULT 0,
  total_redeemed INT             NOT NULL DEFAULT 0,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lp_user_id (user_id),
  CONSTRAINT fk_lp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  points     INT             NOT NULL,
  type       ENUM('EARNED','REDEEMED','EXPIRED') NOT NULL,
  reason     VARCHAR(300)    NULL,
  order_id   BIGINT UNSIGNED NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_lt_user_id   (user_id),
  INDEX idx_lt_type      (type),
  INDEX idx_lt_order_id  (order_id),
  CONSTRAINT fk_lt_user  FOREIGN KEY (user_id)  REFERENCES users   (id) ON DELETE CASCADE,
  CONSTRAINT fk_lt_order FOREIGN KEY (order_id) REFERENCES orders  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS referrals (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  referrer_id    BIGINT UNSIGNED NOT NULL,
  referred_id    BIGINT UNSIGNED NOT NULL,
  code           VARCHAR(10)     NOT NULL,
  status         ENUM('PENDING','COMPLETED') NOT NULL DEFAULT 'PENDING',
  reward_amount  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ref_referred (referred_id),
  INDEX idx_ref_referrer_id (referrer_id),
  INDEX idx_ref_code        (code),
  INDEX idx_ref_status      (status),
  CONSTRAINT fk_ref_referrer FOREIGN KEY (referrer_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ref_referred FOREIGN KEY (referred_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 15: REVIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS product_reviews (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id           BIGINT UNSIGNED NOT NULL,
  user_id              BIGINT UNSIGNED NOT NULL,
  order_item_id        BIGINT UNSIGNED NULL,
  rating               TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                VARCHAR(200)    NULL,
  review               TEXT            NULL,
  images_json          JSON            NULL,
  is_verified_purchase TINYINT(1)      NOT NULL DEFAULT 0,
  is_approved          TINYINT(1)      NOT NULL DEFAULT 0,
  helpful_count        INT             NOT NULL DEFAULT 0,
  created_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pr_product_user (product_id, user_id),
  INDEX idx_pr_product_id    (product_id),
  INDEX idx_pr_user_id       (user_id),
  INDEX idx_pr_rating        (rating),
  INDEX idx_pr_is_approved   (is_approved),
  CONSTRAINT fk_pr_product    FOREIGN KEY (product_id)    REFERENCES products    (id) ON DELETE CASCADE,
  CONSTRAINT fk_pr_user       FOREIGN KEY (user_id)       REFERENCES users       (id) ON DELETE CASCADE,
  CONSTRAINT fk_pr_order_item FOREIGN KEY (order_item_id) REFERENCES order_items (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_reviews (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  service_id BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  booking_id BIGINT UNSIGNED NOT NULL,
  rating     TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review     TEXT            NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sr_service_booking (service_id, booking_id),
  INDEX idx_sr_service_id (service_id),
  INDEX idx_sr_user_id    (user_id),
  CONSTRAINT fk_sr_service  FOREIGN KEY (service_id) REFERENCES services  (id) ON DELETE CASCADE,
  CONSTRAINT fk_sr_user     FOREIGN KEY (user_id)    REFERENCES users      (id) ON DELETE CASCADE,
  CONSTRAINT fk_sr_booking  FOREIGN KEY (booking_id) REFERENCES bookings   (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS freelancer_reviews (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  freelancer_id BIGINT UNSIGNED NOT NULL,
  client_id     BIGINT UNSIGNED NOT NULL,
  project_id    BIGINT UNSIGNED NOT NULL,
  rating        TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review        TEXT            NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_flr_freelancer_project (freelancer_id, project_id),
  INDEX idx_flr_freelancer_id (freelancer_id),
  INDEX idx_flr_client_id     (client_id),
  CONSTRAINT fk_flr_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancers (id) ON DELETE CASCADE,
  CONSTRAINT fk_flr_client     FOREIGN KEY (client_id)     REFERENCES users        (id) ON DELETE CASCADE,
  CONSTRAINT fk_flr_project    FOREIGN KEY (project_id)    REFERENCES projects     (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 16: NOTIFICATIONS & CHAT
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  type       ENUM('ORDER','BOOKING','PAYMENT','SYSTEM','PROMO','CHAT') NOT NULL,
  title      VARCHAR(200)    NOT NULL,
  message    TEXT            NOT NULL,
  data_json  JSON            NULL,
  is_read    TINYINT(1)      NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_notif_user_id    (user_id),
  INDEX idx_notif_type       (type),
  INDEX idx_notif_is_read    (is_read),
  INDEX idx_notif_created_at (created_at),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_rooms (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type             ENUM('ORDER','BOOKING','PROJECT','SUPPORT') NOT NULL,
  reference_id     BIGINT UNSIGNED NOT NULL,
  participant1_id  BIGINT UNSIGNED NOT NULL,
  participant2_id  BIGINT UNSIGNED NOT NULL,
  last_message     TEXT            NULL,
  last_message_at  DATETIME        NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cr_type_ref_participants (type, reference_id, participant1_id, participant2_id),
  INDEX idx_cr_participant1 (participant1_id),
  INDEX idx_cr_participant2 (participant2_id),
  INDEX idx_cr_type         (type),
  CONSTRAINT fk_cr_p1 FOREIGN KEY (participant1_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_cr_p2 FOREIGN KEY (participant2_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id      BIGINT UNSIGNED NOT NULL,
  sender_id    BIGINT UNSIGNED NOT NULL,
  message      TEXT            NULL,
  message_type ENUM('TEXT','IMAGE','FILE','SYSTEM') NOT NULL DEFAULT 'TEXT',
  file_url     VARCHAR(500)    NULL,
  is_read      TINYINT(1)      NOT NULL DEFAULT 0,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_cm_room_id    (room_id),
  INDEX idx_cm_sender_id  (sender_id),
  INDEX idx_cm_created_at (created_at),
  CONSTRAINT fk_cm_room   FOREIGN KEY (room_id)   REFERENCES chat_rooms (id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_sender FOREIGN KEY (sender_id) REFERENCES users      (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 17: SUPPORT & AUDIT
-- ============================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  subject     VARCHAR(300)    NOT NULL,
  description TEXT            NOT NULL,
  category    ENUM('ORDER','PAYMENT','ACCOUNT','SERVICE','FREELANCER','GENERAL') NOT NULL DEFAULT 'GENERAL',
  status      ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  priority    ENUM('LOW','MEDIUM','HIGH','URGENT') NOT NULL DEFAULT 'MEDIUM',
  assigned_to BIGINT UNSIGNED NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_st_user_id     (user_id),
  INDEX idx_st_status      (status),
  INDEX idx_st_priority    (priority),
  INDEX idx_st_category    (category),
  INDEX idx_st_assigned_to (assigned_to),
  CONSTRAINT fk_st_user     FOREIGN KEY (user_id)     REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_st_assignee FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NULL,
  action           VARCHAR(100)    NOT NULL,
  resource_type    VARCHAR(80)     NOT NULL,
  resource_id      VARCHAR(50)     NULL,
  old_value_json   JSON            NULL,
  new_value_json   JSON            NULL,
  ip_address       VARCHAR(45)     NULL,
  user_agent       VARCHAR(500)    NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_al_user_id       (user_id),
  INDEX idx_al_resource_type (resource_type),
  INDEX idx_al_action        (action),
  INDEX idx_al_created_at    (created_at),
  CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  key_name    VARCHAR(100)  NOT NULL,
  value       TEXT          NOT NULL,
  description VARCHAR(500)  NULL,
  updated_by  BIGINT UNSIGNED NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_settings_key_name (key_name),
  INDEX idx_settings_updated_by (updated_by),
  CONSTRAINT fk_settings_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_pages (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title            VARCHAR(300)  NOT NULL,
  slug             VARCHAR(100)  NOT NULL,
  content          LONGTEXT      NOT NULL,
  meta_title       VARCHAR(200)  NULL,
  meta_description VARCHAR(400)  NULL,
  is_published     TINYINT(1)    NOT NULL DEFAULT 0,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cms_slug (slug),
  INDEX idx_cms_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
