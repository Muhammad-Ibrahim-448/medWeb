-- ============================================================
-- Shoaib Jewellers — Complete Database Schema
-- MySQL 8.0+
-- ============================================================

DROP DATABASE IF EXISTS shoaib_jewellers;
CREATE DATABASE shoaib_jewellers
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shoaib_jewellers;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE users (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  phone           VARCHAR(50) DEFAULT NULL,
  role            ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  status          ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  email_verified  TINYINT(1) NOT NULL DEFAULT 0,
  last_login_at   TIMESTAMP NULL DEFAULT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_status (status),
  KEY idx_users_created_at (created_at),
  KEY idx_users_role_status (role, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. CATEGORIES TABLE
-- ============================================================
CREATE TABLE categories (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(150) NOT NULL,
  slug            VARCHAR(180) NOT NULL,
  description     TEXT DEFAULT NULL,
  image           VARCHAR(500) DEFAULT NULL,
  parent_id       INT UNSIGNED DEFAULT NULL,
  gender          ENUM('men', 'women', 'unisex', 'kids') NOT NULL DEFAULT 'unisex',
  sort_order      INT NOT NULL DEFAULT 0,
  status          ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug),
  KEY idx_categories_parent (parent_id),
  KEY idx_categories_status (status),
  KEY idx_categories_gender (gender),
  KEY idx_categories_gender_status (gender, status),
  KEY idx_categories_sort (sort_order),
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name                  VARCHAR(255) NOT NULL,
  slug                  VARCHAR(280) NOT NULL,
  sku                   VARCHAR(100) NOT NULL,
  category_id           INT UNSIGNED DEFAULT NULL,
  description           LONGTEXT DEFAULT NULL,
  short_description     VARCHAR(500) DEFAULT NULL,
  price                 DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  sale_price            DECIMAL(12,2) DEFAULT NULL,
  cost_price            DECIMAL(12,2) DEFAULT NULL,
  stock_quantity        INT NOT NULL DEFAULT 0,
  low_stock_threshold   INT NOT NULL DEFAULT 5,
  material              VARCHAR(255) DEFAULT NULL,
  weight                VARCHAR(100) DEFAULT NULL,
  size                  VARCHAR(100) DEFAULT NULL,
  stone                 VARCHAR(255) DEFAULT NULL,
  gender                ENUM('men', 'women', 'unisex', 'kids') NOT NULL DEFAULT 'unisex',
  featured              TINYINT(1) NOT NULL DEFAULT 0,
  status                ENUM('active', 'draft', 'archived') NOT NULL DEFAULT 'active',
  views_count           INT UNSIGNED NOT NULL DEFAULT 0,
  sold_count            INT UNSIGNED NOT NULL DEFAULT 0,
  meta_title            VARCHAR(255) DEFAULT NULL,
  meta_description      VARCHAR(500) DEFAULT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  UNIQUE KEY uq_products_sku (sku),
  KEY idx_products_category (category_id),
  KEY idx_products_status (status),
  KEY idx_products_gender (gender),
  KEY idx_products_featured (featured),
  KEY idx_products_price (price),
  KEY idx_products_created_at (created_at),
  KEY idx_products_stock (stock_quantity),
  KEY idx_products_status_gender (status, gender),
  KEY idx_products_status_featured (status, featured),
  KEY idx_products_category_status (category_id, status),
  KEY idx_products_gender_status_created (gender, status, created_at),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Full-text search index for product search
ALTER TABLE products
  ADD FULLTEXT KEY ft_products_search (name, short_description, description, sku);

-- ============================================================
-- 4. PRODUCT IMAGES TABLE
-- ============================================================
CREATE TABLE product_images (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  image_url     VARCHAR(500) NOT NULL,
  alt_text      VARCHAR(255) DEFAULT NULL,
  is_primary    TINYINT(1) NOT NULL DEFAULT 0,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_images_product (product_id),
  KEY idx_product_images_primary (product_id, is_primary),
  KEY idx_product_images_sort (product_id, sort_order),
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. ADDRESSES TABLE
-- ============================================================
CREATE TABLE addresses (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  label         VARCHAR(50) DEFAULT 'Home',
  full_name     VARCHAR(255) NOT NULL,
  phone         VARCHAR(50) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) DEFAULT NULL,
  city          VARCHAR(100) NOT NULL,
  state         VARCHAR(100) DEFAULT NULL,
  postal_code   VARCHAR(20) DEFAULT NULL,
  country       VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
  is_default    TINYINT(1) NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_addresses_user (user_id),
  KEY idx_addresses_default (user_id, is_default),
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number          VARCHAR(50) NOT NULL,
  user_id               INT UNSIGNED NOT NULL,
  customer_name         VARCHAR(255) NOT NULL,
  customer_email        VARCHAR(255) NOT NULL,
  customer_phone        VARCHAR(50) NOT NULL,
  shipping_full_name    VARCHAR(255) NOT NULL,
  shipping_phone        VARCHAR(50) NOT NULL,
  shipping_address1     VARCHAR(255) NOT NULL,
  shipping_address2     VARCHAR(255) DEFAULT NULL,
  shipping_city         VARCHAR(100) NOT NULL,
  shipping_state        VARCHAR(100) DEFAULT NULL,
  shipping_postal_code  VARCHAR(20) DEFAULT NULL,
  shipping_country      VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
  subtotal              DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  shipping_fee          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_amount       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total                 DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  payment_method        VARCHAR(50) NOT NULL DEFAULT 'cod',
  payment_status        ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  order_status          ENUM('pending','confirmed','processing','shipped','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
  transaction_id        VARCHAR(255) DEFAULT NULL,
  notes                 TEXT DEFAULT NULL,
  admin_notes           TEXT DEFAULT NULL,
  shipped_at            TIMESTAMP NULL DEFAULT NULL,
  delivered_at          TIMESTAMP NULL DEFAULT NULL,
  cancelled_at          TIMESTAMP NULL DEFAULT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_number (order_number),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (order_status),
  KEY idx_orders_payment_status (payment_status),
  KEY idx_orders_created_at (created_at),
  KEY idx_orders_user_status (user_id, order_status),
  KEY idx_orders_status_created (order_status, created_at),
  KEY idx_orders_email (customer_email),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE order_items (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id        INT UNSIGNED NOT NULL,
  product_id      INT UNSIGNED DEFAULT NULL,
  product_name    VARCHAR(255) NOT NULL,
  product_sku     VARCHAR(100) DEFAULT NULL,
  product_image   VARCHAR(500) DEFAULT NULL,
  product_price   DECIMAL(12,2) NOT NULL,
  quantity        INT NOT NULL DEFAULT 1,
  subtotal        DECIMAL(12,2) NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. CART ITEMS TABLE
-- ============================================================
CREATE TABLE cart_items (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_user_product (user_id, product_id),
  KEY idx_cart_user (user_id),
  KEY idx_cart_product (product_id),
  CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. WISHLIST ITEMS TABLE
-- ============================================================
CREATE TABLE wishlist_items (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist_user_product (user_id, product_id),
  KEY idx_wishlist_user (user_id),
  KEY idx_wishlist_product (product_id),
  CONSTRAINT fk_wishlist_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wishlist_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. SITE SETTINGS TABLE
-- ============================================================
CREATE TABLE site_settings (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key   VARCHAR(100) NOT NULL,
  setting_value TEXT DEFAULT NULL,
  setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_settings_key (setting_key),
  KEY idx_settings_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. INVENTORY LOGS TABLE (audit trail)
-- ============================================================
CREATE TABLE inventory_logs (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  change_type   ENUM('order','restock','adjustment','return','cancel') NOT NULL,
  quantity_change INT NOT NULL,
  previous_stock  INT NOT NULL,
  new_stock       INT NOT NULL,
  reference_id    INT UNSIGNED DEFAULT NULL,
  note            VARCHAR(255) DEFAULT NULL,
  created_by      INT UNSIGNED DEFAULT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inv_logs_product (product_id),
  KEY idx_inv_logs_type (change_type),
  KEY idx_inv_logs_created (created_at),
  CONSTRAINT fk_inv_logs_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. BLOG POSTS TABLE
-- ============================================================
CREATE TABLE blog_posts (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(280) NOT NULL,
  excerpt       VARCHAR(500) DEFAULT NULL,
  content       LONGTEXT DEFAULT NULL,
  cover_image   VARCHAR(500) DEFAULT NULL,
  author_id     INT UNSIGNED DEFAULT NULL,
  status        ENUM('published','draft') NOT NULL DEFAULT 'draft',
  published_at  TIMESTAMP NULL DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_slug (slug),
  KEY idx_blog_status (status),
  KEY idx_blog_published (published_at),
  CONSTRAINT fk_blog_author
    FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ============================================================
-- 13. CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE contact_messages (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(50) DEFAULT NULL,
  subject       VARCHAR(255) DEFAULT NULL,
  message       TEXT NOT NULL,
  status        ENUM('new','read','replied','archived','spam') NOT NULL DEFAULT 'new',
  ip_address    VARCHAR(45) DEFAULT NULL,
  user_agent    VARCHAR(500) DEFAULT NULL,
  replied_at    TIMESTAMP NULL DEFAULT NULL,
  replied_by    INT UNSIGNED DEFAULT NULL,
  admin_notes   TEXT DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_status (status),
  KEY idx_contact_created (created_at),
  KEY idx_contact_email (email),
  KEY idx_contact_status_created (status, created_at),
  CONSTRAINT fk_contact_replied_by
    FOREIGN KEY (replied_by) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;