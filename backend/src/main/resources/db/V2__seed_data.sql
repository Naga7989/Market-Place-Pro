-- ============================================================
-- FLYWAY MIGRATION V2
-- INDIA-FIRST ENTERPRISE MARKETPLACE PLATFORM
-- Seed Data: Roles, Permissions, Categories, Settings, Admin
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+05:30';

-- ============================================================
-- ROLES (8 total)
-- ============================================================

INSERT IGNORE INTO roles (name, description) VALUES
  ('SUPER_ADMIN',       'Full platform access — no restrictions'),
  ('ADMIN',             'Platform administrator with broad management rights'),
  ('VENDOR_MANAGER',    'Manages vendor onboarding and approvals'),
  ('VENDOR',            'Sells physical or digital products on the marketplace'),
  ('SERVICE_PROVIDER',  'Offers on-demand home and professional services'),
  ('FREELANCER',        'Takes on freelance projects from clients'),
  ('DELIVERY_PARTNER',  'Delivers orders to customers'),
  ('CUSTOMER',          'Standard registered buyer');

-- ============================================================
-- PERMISSIONS (35 total)
-- ============================================================

INSERT IGNORE INTO permissions (name, resource, action) VALUES
  -- User management
  ('View users',           'users',           'READ'),
  ('Create users',         'users',           'CREATE'),
  ('Update users',         'users',           'UPDATE'),
  ('Delete users',         'users',           'DELETE'),
  ('Manage user roles',    'users',           'ASSIGN_ROLE'),
  -- Product management
  ('View products',        'products',        'READ'),
  ('Create products',      'products',        'CREATE'),
  ('Update products',      'products',        'UPDATE'),
  ('Delete products',      'products',        'DELETE'),
  ('Approve products',     'products',        'APPROVE'),
  -- Order management
  ('View orders',          'orders',          'READ'),
  ('Update order status',  'orders',          'UPDATE'),
  ('Cancel orders',        'orders',          'CANCEL'),
  ('Process refunds',      'orders',          'REFUND'),
  -- Vendor management
  ('View vendors',         'vendors',         'READ'),
  ('Approve vendors',      'vendors',         'APPROVE'),
  ('Suspend vendors',      'vendors',         'SUSPEND'),
  -- Service management
  ('View services',        'services',        'READ'),
  ('Create services',      'services',        'CREATE'),
  ('Update services',      'services',        'UPDATE'),
  ('Delete services',      'services',        'DELETE'),
  ('Approve services',     'services',        'APPROVE'),
  -- Booking management
  ('View bookings',        'bookings',        'READ'),
  ('Update bookings',      'bookings',        'UPDATE'),
  -- Freelancer management
  ('View projects',        'projects',        'READ'),
  ('Create projects',      'projects',        'CREATE'),
  ('Manage proposals',     'proposals',       'MANAGE'),
  -- Payment management
  ('View payments',        'payments',        'READ'),
  ('Process payments',     'payments',        'PROCESS'),
  -- Coupon management
  ('Manage coupons',       'coupons',         'MANAGE'),
  -- Reports & analytics
  ('View analytics',       'analytics',       'READ'),
  ('Export reports',       'reports',         'EXPORT'),
  -- Settings
  ('Manage settings',      'settings',        'MANAGE'),
  -- Content
  ('Manage CMS',           'cms_pages',       'MANAGE'),
  -- Support
  ('Manage support',       'support_tickets', 'MANAGE');

-- ============================================================
-- ROLE → PERMISSION ASSIGNMENTS
-- ============================================================

-- SUPER_ADMIN gets all permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'SUPER_ADMIN';

-- ADMIN gets most permissions (all except assign_role, delete users)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name NOT IN ('Delete users', 'Manage user roles')
WHERE r.name = 'ADMIN'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- VENDOR_MANAGER
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.resource IN ('vendors','products') OR p.name IN ('View orders','View users','View analytics')
WHERE r.name = 'VENDOR_MANAGER'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- VENDOR
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.resource = 'products' AND p.action IN ('READ','CREATE','UPDATE')
   OR (p.resource = 'orders' AND p.action = 'READ')
   OR (p.resource = 'coupons' AND p.action = 'MANAGE')
WHERE r.name = 'VENDOR'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- SERVICE_PROVIDER
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (p.resource = 'services' AND p.action IN ('READ','CREATE','UPDATE'))
   OR (p.resource = 'bookings' AND p.action IN ('READ','UPDATE'))
WHERE r.name = 'SERVICE_PROVIDER'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- FREELANCER
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.resource IN ('projects','proposals') AND p.action IN ('READ','CREATE','MANAGE')
WHERE r.name = 'FREELANCER'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- DELIVERY_PARTNER
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.resource = 'orders' AND p.action IN ('READ','UPDATE')
WHERE r.name = 'DELIVERY_PARTNER'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- CUSTOMER
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.resource IN ('products','services','projects','bookings','orders')
  AND p.action = 'READ'
  OR (p.resource = 'projects' AND p.action = 'CREATE')
WHERE r.name = 'CUSTOMER'
ON DUPLICATE KEY UPDATE role_id = role_id;

-- ============================================================
-- PRODUCT CATEGORIES (10 top-level + subcategories)
-- ============================================================

-- Level 1: Top-level categories
INSERT IGNORE INTO categories (parent_id, name, slug, description, icon, level, sort_order, is_active) VALUES
  (NULL, 'Electronics',          'electronics',          'Mobiles, Laptops, Cameras & accessories',         'laptop',       1, 1,  1),
  (NULL, 'Fashion',              'fashion',              'Clothing, footwear & accessories for all ages',   'shirt',        1, 2,  1),
  (NULL, 'Home & Kitchen',       'home-kitchen',         'Furniture, decor & kitchen appliances',           'home',         1, 3,  1),
  (NULL, 'Beauty & Health',      'beauty-health',        'Skincare, haircare, wellness & personal care',    'heart',        1, 4,  1),
  (NULL, 'Grocery & Gourmet',    'grocery-gourmet',      'Fresh produce, packaged foods & beverages',       'shopping-bag', 1, 5,  1),
  (NULL, 'Books & Stationery',   'books-stationery',     'Books, e-books, pens & office supplies',          'book',         1, 6,  1),
  (NULL, 'Sports & Fitness',     'sports-fitness',       'Gym equipment, sports gear & outdoor items',      'activity',     1, 7,  1),
  (NULL, 'Toys & Baby',          'toys-baby',            'Toys, games, baby gear & nursery products',       'gift',         1, 8,  1),
  (NULL, 'Automotive',           'automotive',           'Car & bike accessories, tools & spare parts',     'truck',        1, 9,  1),
  (NULL, 'Industrial & B2B',     'industrial-b2b',       'Tools, safety equipment & business supplies',     'tool',         1, 10, 1);

-- Level 2: Electronics subcategories
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Mobiles & Smartphones', 'electronics-mobiles',        'All smartphones and accessories', 2, 1, 1 FROM categories WHERE slug = 'electronics';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Laptops & Computers',   'electronics-laptops',        'Laptops, desktops, tablets',      2, 2, 1 FROM categories WHERE slug = 'electronics';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Cameras & Photography', 'electronics-cameras',        'DSLR, mirrorless & accessories',  2, 3, 1 FROM categories WHERE slug = 'electronics';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Audio & Headphones',    'electronics-audio',          'Earphones, speakers & soundbars', 2, 4, 1 FROM categories WHERE slug = 'electronics';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Smart Home & IoT',      'electronics-smart-home',     'Smart devices, automation hubs',  2, 5, 1 FROM categories WHERE slug = 'electronics';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'TV & Home Theatre',     'electronics-tv',             'Televisions & projectors',        2, 6, 1 FROM categories WHERE slug = 'electronics';

-- Level 2: Fashion subcategories
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, "Men's Clothing",   'fashion-mens',        'Shirts, trousers, ethnic wear',   2, 1, 1 FROM categories WHERE slug = 'fashion';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, "Women's Clothing", 'fashion-womens',      'Sarees, kurtis, western wear',    2, 2, 1 FROM categories WHERE slug = 'fashion';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, "Kids' Clothing",   'fashion-kids',        'Boys, girls & infant clothing',   2, 3, 1 FROM categories WHERE slug = 'fashion';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Footwear',         'fashion-footwear',    'Sports shoes, sandals & heels',   2, 4, 1 FROM categories WHERE slug = 'fashion';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Watches',          'fashion-watches',     'Analog, digital & smartwatches',  2, 5, 1 FROM categories WHERE slug = 'fashion';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Bags & Luggage',   'fashion-bags',        'Handbags, backpacks & trolleys',  2, 6, 1 FROM categories WHERE slug = 'fashion';

-- Level 2: Home & Kitchen subcategories
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Furniture',        'home-furniture',      'Sofas, beds, wardrobes & tables', 2, 1, 1 FROM categories WHERE slug = 'home-kitchen';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Kitchen Appliances','home-kitchen-appliances','Mixer, cooker, microwave',     2, 2, 1 FROM categories WHERE slug = 'home-kitchen';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Cookware & Dining', 'home-cookware',      'Pots, pans, plates & cutlery',   2, 3, 1 FROM categories WHERE slug = 'home-kitchen';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Home Decor',        'home-decor',         'Curtains, lamps & wall art',      2, 4, 1 FROM categories WHERE slug = 'home-kitchen';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Bedding & Linen',   'home-bedding',       'Sheets, pillows & comforters',    2, 5, 1 FROM categories WHERE slug = 'home-kitchen';

-- Level 2: Beauty & Health subcategories
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Skincare',          'beauty-skincare',    'Moisturisers, serums & sunscreen', 2, 1, 1 FROM categories WHERE slug = 'beauty-health';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Haircare',          'beauty-haircare',    'Shampoos, oils & styling tools',   2, 2, 1 FROM categories WHERE slug = 'beauty-health';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Vitamins & Supplements','health-supplements','Protein, vitamins & minerals',  2, 3, 1 FROM categories WHERE slug = 'beauty-health';
INSERT IGNORE INTO categories (parent_id, name, slug, description, level, sort_order, is_active)
SELECT id, 'Personal Care',     'beauty-personal',    'Grooming, dental & hygiene',       2, 4, 1 FROM categories WHERE slug = 'beauty-health';

-- ============================================================
-- SERVICE CATEGORIES (8 top-level)
-- ============================================================

INSERT IGNORE INTO service_categories (parent_id, name, slug, description, icon, is_active) VALUES
  (NULL, 'Home Services',    'home-services',   'Cleaning, plumbing, electrical & carpentry',     'home',     1),
  (NULL, 'Beauty & Spa',     'beauty-spa',      'Salon at home, massage & beauty treatments',     'scissors', 1),
  (NULL, 'Education',        'education',       'Tutoring, language classes & skill training',    'book',     1),
  (NULL, 'Healthcare',       'healthcare',      'Doctor visits, nursing & physiotherapy at home', 'heart',    1),
  (NULL, 'Vehicle Services', 'vehicle',         'Car wash, bike service & roadside assistance',   'truck',    1),
  (NULL, 'Business Services','business',        'Accounting, legal & tax filing services',        'briefcase',1),
  (NULL, 'Travel & Tours',   'travel-tours',    'Local guides, trip planning & cab booking',      'map',      1),
  (NULL, 'Events & Catering','events-catering', 'Photography, catering & event decoration',       'camera',   1);

-- Level 2: Home Services subcategories
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Deep Cleaning',      'home-deep-cleaning',    'Full home deep clean service',        1 FROM service_categories WHERE slug = 'home-services';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Plumbing',           'home-plumbing',         'Tap, pipe & bathroom repairs',        1 FROM service_categories WHERE slug = 'home-services';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Electrician',        'home-electrician',      'Wiring, fixtures & appliance repair', 1 FROM service_categories WHERE slug = 'home-services';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Carpentry',          'home-carpentry',        'Furniture assembly & wood repairs',   1 FROM service_categories WHERE slug = 'home-services';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Pest Control',       'home-pest-control',     'Cockroach, termite & rodent control', 1 FROM service_categories WHERE slug = 'home-services';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'AC Service & Repair','home-ac-service',       'AC cleaning, gas refill & repair',    1 FROM service_categories WHERE slug = 'home-services';

-- Level 2: Beauty & Spa subcategories
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Women Salon at Home', 'beauty-womens-salon', 'Waxing, facial, threading & mani-pedi',     1 FROM service_categories WHERE slug = 'beauty-spa';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Men Grooming',        'beauty-mens-salon',   'Haircut, shave, beard styling at home',      1 FROM service_categories WHERE slug = 'beauty-spa';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Massage & Relaxation','beauty-massage',      'Body massage, head massage & spa',           1 FROM service_categories WHERE slug = 'beauty-spa';

-- Level 2: Education subcategories
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Home Tuition',        'edu-home-tuition',    'K-12 home tutoring across subjects',         1 FROM service_categories WHERE slug = 'education';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Language Classes',    'edu-language',        'English, French, German & other languages',  1 FROM service_categories WHERE slug = 'education';
INSERT IGNORE INTO service_categories (parent_id, name, slug, description, is_active)
SELECT id, 'Music & Dance',       'edu-music-dance',     'Guitar, piano, classical dance & yoga',      1 FROM service_categories WHERE slug = 'education';

-- ============================================================
-- PLATFORM SETTINGS
-- ============================================================

INSERT IGNORE INTO settings (key_name, value, description) VALUES
  ('platform.name',                          'BazaarIndia',          'Platform display name'),
  ('platform.currency',                      'INR',                  'Default currency (ISO 4217)'),
  ('platform.currency_symbol',               '₹',                    'Currency symbol for display'),
  ('platform.gst_rate',                      '18',                   'Default GST rate in percent'),
  ('platform.commission_default',            '10',                   'Default vendor commission rate (%)'),
  ('platform.commission_service',            '15',                   'Service provider commission rate (%)'),
  ('platform.commission_freelancer',         '12',                   'Freelancer platform fee (%)'),
  ('platform.min_order_amount',              '99',                   'Minimum order amount in INR'),
  ('platform.free_delivery_threshold',       '499',                  'Order value above which delivery is free (INR)'),
  ('platform.delivery_charge_flat',          '49',                   'Flat delivery charge below threshold (INR)'),
  ('platform.max_delivery_days',             '7',                    'Maximum estimated delivery days'),
  ('platform.cod_limit',                     '10000',                'Maximum order value eligible for COD (INR)'),
  ('platform.wallet_max_balance',            '100000',               'Maximum wallet balance per user (INR)'),
  ('platform.loyalty_points_per_inr',        '1',                    'Loyalty points earned per INR spent'),
  ('platform.loyalty_inr_per_point',         '0.25',                 'INR value per loyalty point at redemption'),
  ('platform.referral_reward_referrer',      '100',                  'Referral reward for referrer (INR wallet credit)'),
  ('platform.referral_reward_referred',      '50',                   'Referral reward for new user (INR wallet credit)'),
  ('platform.otp_expiry_minutes',            '10',                   'OTP validity in minutes'),
  ('platform.refresh_token_days',            '30',                   'JWT refresh token validity in days'),
  ('platform.access_token_minutes',          '15',                   'JWT access token validity in minutes'),
  ('razorpay.key_id',                        'rzp_test_PLACEHOLDER', 'Razorpay Key ID (override via env)'),
  ('razorpay.currency',                      'INR',                  'Razorpay currency code'),
  ('gemini.model',                           'gemini-1.5-pro',       'Google Gemini model to use for AI features'),
  ('gemini.max_tokens',                      '2048',                 'Max tokens for Gemini API responses'),
  ('elasticsearch.index_products',           'marketplace_products', 'ES index for products'),
  ('elasticsearch.index_services',           'marketplace_services', 'ES index for services'),
  ('elasticsearch.index_freelancers',        'marketplace_freelancers','ES index for freelancers'),
  ('support.email',                          'support@bazaarindia.in','Customer support email'),
  ('support.phone',                          '+91-800-000-0000',     'Customer support phone number'),
  ('platform.vendor_kyc_required',           'true',                 'Whether KYC docs are mandatory for vendor approval'),
  ('platform.auto_approve_vendors',          'false',                'Auto-approve vendors without manual review'),
  ('platform.max_product_images',            '8',                    'Maximum product images per listing'),
  ('platform.max_product_variants',          '50',                   'Maximum variants per product'),
  ('platform.search_results_per_page',       '24',                   'Default search results per page');

-- ============================================================
-- SUPER ADMIN USER
-- Password: Admin@123! (bcrypt $2b$12$...)
-- ============================================================

INSERT IGNORE INTO users (email, phone, password_hash, full_name, is_email_verified, is_phone_verified, is_active)
VALUES (
  'superadmin@bazaarindia.in',
  '+919000000001',
  '$2a$12$PYUcZNbwKuuwdOFU2J2NBOu1Gk/kFBv.pL3WpgBbx6GNK/2gnBe/.',
  'Super Administrator',
  1,
  1,
  1
);

-- Assign SUPER_ADMIN role
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'superadmin@bazaarindia.in'
  AND r.name = 'SUPER_ADMIN';

-- Create wallet for super admin
INSERT IGNORE INTO wallets (user_id, balance, locked_balance, currency, is_active)
SELECT id, 0.00, 0.00, 'INR', 1
FROM users WHERE email = 'superadmin@bazaarindia.in';

-- Create loyalty points record for super admin
INSERT IGNORE INTO loyalty_points (user_id, points, total_earned, total_redeemed)
SELECT id, 0, 0, 0
FROM users WHERE email = 'superadmin@bazaarindia.in';

-- ============================================================
-- SAMPLE SERVICE AVAILABILITY PATTERNS
-- (For demo purposes; real providers added via API)
-- ============================================================

-- Note: These are template comments — actual providers are created via the application.
-- The service_availability table is populated when a service_provider registers
-- and configures their availability. The typical pattern for Indian service providers is:
--
-- Monday–Saturday: 08:00–20:00 (available)
-- Sunday: 10:00–17:00 (limited availability)
--
-- This is enforced at the application layer using service_availability rows:
-- INSERT IGNORE INTO service_availability (provider_id, day_of_week, start_time, end_time, is_available)
-- VALUES
--   (?, 1, '08:00:00', '20:00:00', 1),  -- Monday
--   (?, 2, '08:00:00', '20:00:00', 1),  -- Tuesday
--   (?, 3, '08:00:00', '20:00:00', 1),  -- Wednesday
--   (?, 4, '08:00:00', '20:00:00', 1),  -- Thursday
--   (?, 5, '08:00:00', '20:00:00', 1),  -- Friday
--   (?, 6, '08:00:00', '18:00:00', 1),  -- Saturday
--   (?, 0, '10:00:00', '17:00:00', 1);  -- Sunday

-- ============================================================
-- CMS PAGES
-- ============================================================

INSERT IGNORE INTO cms_pages (title, slug, content, meta_title, meta_description, is_published) VALUES
  ('About Us',        'about-us',        '<h1>About BazaarIndia</h1><p>India''s first all-in-one marketplace combining e-commerce, home services, and freelancing in one platform. We serve millions of customers across India with local vendors, trusted service professionals, and skilled freelancers.</p>', 'About BazaarIndia - India''s All-in-One Marketplace', 'Learn about BazaarIndia, India''s first super-platform combining Amazon-style e-commerce, Urban Company-style services, and Fiverr-style freelancing.', 1),
  ('Terms of Service','terms-of-service','<h1>Terms of Service</h1><p>By using BazaarIndia you agree to our terms and conditions...</p>', 'Terms of Service | BazaarIndia', 'Read BazaarIndia terms of service for buyers, sellers, service providers and freelancers.', 1),
  ('Privacy Policy',  'privacy-policy',  '<h1>Privacy Policy</h1><p>We take your privacy seriously. This policy explains what data we collect and how we use it...</p>', 'Privacy Policy | BazaarIndia', 'Read BazaarIndia privacy policy to understand how we protect your data.', 1),
  ('Seller Guide',    'seller-guide',    '<h1>How to Sell on BazaarIndia</h1><p>Register, verify your KYC, list products, and start selling to crores of Indian buyers.</p>', 'Seller Guide | BazaarIndia', 'Complete guide to selling products on BazaarIndia marketplace.', 1),
  ('Shipping Policy', 'shipping-policy', '<h1>Shipping Policy</h1><p>We deliver across 25,000+ pin codes in India. Free shipping on orders above ₹499.</p>', 'Shipping Policy | BazaarIndia', 'BazaarIndia shipping, delivery timelines and return policy details.', 1),
  ('Return Policy',   'return-policy',   '<h1>Return & Refund Policy</h1><p>Easy 7-day returns on most products. Refunds processed within 5-7 business days.</p>', 'Return & Refund Policy | BazaarIndia', 'Learn about BazaarIndia''s 7-day return policy and refund process.', 1);

-- ============================================================
-- TAGS (common tags for product discovery)
-- ============================================================

INSERT IGNORE INTO tags (name, slug) VALUES
  ('New Arrival',    'new-arrival'),
  ('Best Seller',    'best-seller'),
  ('Trending',       'trending'),
  ('Deal of the Day','deal-of-the-day'),
  ('Made in India',  'made-in-india'),
  ('Organic',        'organic'),
  ('Premium',        'premium'),
  ('Budget Pick',    'budget-pick'),
  ('Festive Special','festive-special'),
  ('Eco-Friendly',   'eco-friendly'),
  ('Handmade',       'handmade'),
  ('Limited Edition','limited-edition'),
  ('Clearance Sale', 'clearance-sale'),
  ('GST Invoice',    'gst-invoice'),
  ('Free Delivery',  'free-delivery');

-- ============================================================
-- END OF SEED DATA V2
-- ============================================================
