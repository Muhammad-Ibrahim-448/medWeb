USE shoaib_jewellers;

-- ============================================================
-- ADMIN USER
-- Password: admin123
-- ============================================================
INSERT INTO users (name, email, password_hash, phone, role, status, email_verified) VALUES
('Shoaib Admin', 'admin@shoaibjewellers.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '+92-300-1234567', 'admin', 'active', 1);

-- ============================================================
-- SAMPLE CUSTOMERS
-- Password: customer123
-- ============================================================
INSERT INTO users (name, email, password_hash, phone, role, status, email_verified) VALUES
('Ayesha Khan',   'ayesha@example.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+92-301-1111111', 'customer', 'active', 1),
('Bilal Ahmed',   'bilal@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+92-302-2222222', 'customer', 'active', 1),
('Fatima Malik',  'fatima@example.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+92-303-3333333', 'customer', 'active', 1),
('Hassan Raza',   'hassan@example.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+92-304-4444444', 'customer', 'active', 1);

-- ============================================================
-- CATEGORIES (with gender attribute)
-- ============================================================
INSERT INTO categories (name, slug, description, gender, sort_order, status) VALUES
-- Women's categories
('Women''s Rings',        'womens-rings',        'Exquisite rings crafted for the modern woman', 'women', 1, 'active'),
('Women''s Necklaces',    'womens-necklaces',    'Timeless necklaces to elevate every look',     'women', 2, 'active'),
('Women''s Earrings',     'womens-earrings',     'Elegant earrings that sparkle with grace',     'women', 3, 'active'),
('Women''s Bracelets',    'womens-bracelets',    'Sophisticated bracelets for daily elegance',   'women', 4, 'active'),
('Women''s Bangles',      'womens-bangles',      'Traditional and modern bangles for women',     'women', 5, 'active'),
('Women''s Pendants',     'womens-pendants',     'Meaningful pendants with fine detailing',      'women', 6, 'active'),
('Bridal Jewellery',      'bridal-jewellery',    'Complete bridal sets for your special day',    'women', 7, 'active'),
-- Men's categories
('Men''s Rings',          'mens-rings',          'Bold and refined rings for men',               'men',   10, 'active'),
('Men''s Chains',         'mens-chains',         'Premium gold chains for the modern man',       'men',   11, 'active'),
('Men''s Bracelets',      'mens-bracelets',      'Sophisticated bracelets for men',              'men',   12, 'active'),
('Men''s Cufflinks',      'mens-cufflinks',      'Elegant cufflinks for formal occasions',       'men',   13, 'active'),
('Men''s Watches',        'mens-watches',        'Premium watches for the discerning gentleman', 'men',   14, 'active'),
-- Unisex
('New Arrivals',          'new-arrivals',        'Latest additions to our collection',           'unisex', 20, 'active'),
('Gift Sets',             'gift-sets',           'Curated gift sets for every occasion',         'unisex', 21, 'active');

-- ============================================================
-- PRODUCTS — WOMEN'S JEWELLERY
-- ============================================================
INSERT INTO products
(name, slug, sku, category_id, short_description, description, price, sale_price, cost_price,
 stock_quantity, low_stock_threshold, material, weight, size, stone, gender, featured, status) VALUES

('Classic Gold Ring',
 'classic-gold-ring', 'SJ-WR-001', 1,
 'A timeless 22K gold ring with a polished finish.',
 'The Classic Gold Ring is a timeless piece crafted from 22K gold with a beautifully polished finish. Its minimalist design makes it perfect for everyday wear or as a meaningful gift.',
 125000.00, 115000.00, 95000.00, 15, 5, '22K Gold', '4.2g', 'Size 5-9', NULL, 'women', 1, 'active'),

('Diamond Solitaire Ring',
 'diamond-solitaire-ring', 'SJ-WR-002', 1,
 'An exquisite solitaire diamond ring in 18K gold.',
 'A breathtaking solitaire diamond ring set in 18K gold. The brilliant-cut diamond is hand-selected for its exceptional clarity and fire, making it the perfect symbol of eternal love.',
 450000.00, 420000.00, 340000.00, 8, 3, '18K Gold', '3.5g', 'Size 5-8', '0.5ct Diamond', 'women', 1, 'active'),

('Rose Gold Twist Ring',
 'rose-gold-twist-ring', 'SJ-WR-003', 1,
 'A modern rose gold ring with a twisted design.',
 'Contemporary rose gold ring featuring an elegant twisted band. Perfect for stacking or wearing alone.',
 95000.00, NULL, 70000.00, 20, 5, '18K Rose Gold', '3.8g', 'Size 5-9', NULL, 'women', 0, 'active'),

('Royal Pearl Necklace',
 'royal-pearl-necklace', 'SJ-WN-001', 2,
 'A luxurious pearl necklace with 18K gold accents.',
 'Hand-strung freshwater pearls complemented by 18K gold accents. This royal pearl necklace adds timeless elegance to any outfit.',
 285000.00, 265000.00, 210000.00, 12, 4, '18K Gold & Pearls', '22g', '18 inch', 'Freshwater Pearls', 'women', 1, 'active'),

('Diamond Tennis Necklace',
 'diamond-tennis-necklace', 'SJ-WN-002', 2,
 'A stunning diamond tennis necklace in 18K white gold.',
 'A spectacular diamond tennis necklace featuring 3 carats of brilliant-cut diamonds set in 18K white gold. An heirloom piece for generations.',
 1250000.00, NULL, 950000.00, 4, 2, '18K White Gold', '18g', '16 inch', '3ct Diamonds', 'women', 1, 'active'),

('Gold Chain Necklace',
 'gold-chain-necklace-women', 'SJ-WN-003', 2,
 'A delicate 22K gold chain necklace.',
 'A simple yet elegant 22K gold chain necklace. Perfect for layering or wearing on its own.',
 78000.00, 72000.00, 58000.00, 25, 5, '22K Gold', '6.5g', '20 inch', NULL, 'women', 0, 'active'),

('Elegant Gold Earrings',
 'elegant-gold-earrings', 'SJ-WE-001', 3,
 'Classic 22K gold drop earrings.',
 'Beautifully crafted 22K gold drop earrings with a subtle dangle. Lightweight and comfortable for all-day wear.',
 95000.00, 88000.00, 72000.00, 20, 5, '22K Gold', '5.5g', 'Medium', NULL, 'women', 0, 'active'),

('Diamond Stud Earrings',
 'diamond-stud-earrings', 'SJ-WE-002', 3,
 'Brilliant diamond studs in 18K gold.',
 'Timeless diamond stud earrings featuring two brilliant-cut diamonds in 18K gold settings. The perfect everyday luxury.',
 220000.00, 205000.00, 165000.00, 14, 4, '18K Gold', '2.8g', 'Small', '0.4ct Diamonds', 'women', 1, 'active'),

('Pearl Drop Earrings',
 'pearl-drop-earrings', 'SJ-WE-003', 3,
 'Elegant pearl drop earrings with gold accents.',
 'Classic pearl drop earrings featuring lustrous freshwater pearls suspended from 18K gold hooks.',
 65000.00, NULL, 48000.00, 30, 5, '18K Gold & Pearls', '3.2g', 'Medium', 'Freshwater Pearls', 'women', 0, 'active'),

('Luxury Gold Bracelet',
 'luxury-gold-bracelet', 'SJ-WB-001', 4,
 'A luxurious 22K gold bracelet with intricate detailing.',
 'A statement 22K gold bracelet with intricate handcrafted detailing. Perfect for special occasions.',
 185000.00, 175000.00, 140000.00, 10, 3, '22K Gold', '14g', '7 inch', NULL, 'women', 1, 'active'),

('Diamond Tennis Bracelet',
 'diamond-tennis-bracelet', 'SJ-WB-002', 4,
 'A stunning diamond tennis bracelet in 18K white gold.',
 'A classic diamond tennis bracelet with 2 carats of brilliant-cut diamonds set in 18K white gold.',
 750000.00, NULL, 580000.00, 5, 2, '18K White Gold', '12g', '7 inch', '2ct Diamonds', 'women', 1, 'active'),

('Classic Gold Bangles',
 'classic-gold-bangles', 'SJ-WG-001', 5,
 'A set of two traditional 22K gold bangles.',
 'Traditional 22K gold bangles sold as a pair. Beautifully handcrafted with a classic finish.',
 320000.00, 305000.00, 250000.00, 6, 3, '22K Gold', '28g', '2.6 inch', NULL, 'women', 0, 'active'),

('Bridal Gold Bangles Set',
 'bridal-gold-bangles-set', 'SJ-WG-002', 5,
 'An ornate bridal bangle set with intricate work.',
 'A stunning bridal bangle set featuring six intricately crafted 22K gold bangles. Perfect for weddings and special occasions.',
 850000.00, NULL, 680000.00, 4, 2, '22K Gold', '72g', '2.6 inch', NULL, 'women', 1, 'active'),

('Diamond Pendant',
 'diamond-pendant', 'SJ-WP-001', 6,
 'A delicate diamond pendant in 18K gold.',
 'A beautiful diamond pendant featuring a single brilliant-cut diamond in an 18K gold setting. Comes with an 18K gold chain.',
 195000.00, 185000.00, 150000.00, 14, 4, '18K Gold', '4.5g', '18 inch chain', '0.3ct Diamond', 'women', 0, 'active'),

('Heart Gold Pendant',
 'heart-gold-pendant', 'SJ-WP-002', 6,
 'A romantic heart-shaped 22K gold pendant.',
 'A charming heart-shaped pendant crafted from 22K gold. A meaningful gift for someone special.',
 55000.00, 50000.00, 40000.00, 22, 5, '22K Gold', '3.8g', '18 inch chain', NULL, 'women', 0, 'active'),

('Royal Bridal Set',
 'royal-bridal-set', 'SJ-BR-001', 7,
 'A complete bridal jewellery set in 22K gold.',
 'A magnificent complete bridal set including necklace, earrings, tikka, and jhumar. Expertly crafted from 22K gold for the most important day of your life.',
 1250000.00, 1180000.00, 950000.00, 3, 2, '22K Gold Complete Set', '120g', 'Complete Set', NULL, 'women', 1, 'active'),

('Diamond Bridal Set',
 'diamond-bridal-set', 'SJ-BR-002', 7,
 'A luxurious diamond bridal set in 18K white gold.',
 'An exquisite diamond bridal set featuring a necklace, earrings, and bracelet set with 5 carats of brilliant diamonds in 18K white gold.',
 2850000.00, NULL, 2200000.00, 2, 1, '18K White Gold', '85g', 'Complete Set', '5ct Diamonds', 'women', 1, 'active'),

-- ============================================================
-- PRODUCTS — MEN'S JEWELLERY
-- ============================================================

('Men''s Gold Signet Ring',
 'mens-gold-signet-ring', 'SJ-MR-001', 8,
 'A bold 22K gold signet ring for men.',
 'A powerful 22K gold signet ring with a polished finish. Perfect for a man who appreciates timeless style.',
 165000.00, 155000.00, 125000.00, 12, 4, '22K Gold', '9.5g', 'Size 8-12', NULL, 'men', 1, 'active'),

('Men''s Diamond Ring',
 'mens-diamond-ring', 'SJ-MR-002', 8,
 'A sophisticated diamond ring for men in 18K gold.',
 'A refined men''s ring featuring a single brilliant-cut diamond in a bold 18K gold band.',
 285000.00, NULL, 220000.00, 7, 3, '18K Gold', '8.2g', 'Size 8-12', '0.25ct Diamond', 'men', 0, 'active'),

('Men''s Steel & Gold Ring',
 'mens-steel-gold-ring', 'SJ-MR-003', 8,
 'A modern two-tone ring in steel and 18K gold.',
 'A contemporary men''s ring combining stainless steel with 18K gold accents. Durable and stylish.',
 85000.00, 78000.00, 62000.00, 18, 5, 'Stainless Steel & 18K Gold', '7.8g', 'Size 8-12', NULL, 'men', 0, 'active'),

('Men''s Gold Chain',
 'mens-gold-chain', 'SJ-MC-001', 9,
 'A premium 22K gold chain for men.',
 'A bold and masculine 22K gold chain. Expertly crafted links that catch the light beautifully.',
 450000.00, 425000.00, 360000.00, 9, 3, '22K Gold', '32g', '22 inch', NULL, 'men', 1, 'active'),

('Men''s Rope Chain',
 'mens-rope-chain', 'SJ-MC-002', 9,
 'A classic 22K gold rope chain.',
 'A timeless rope chain crafted from 22K gold. Versatile and elegant for everyday wear.',
 285000.00, NULL, 225000.00, 14, 4, '22K Gold', '20g', '20 inch', NULL, 'men', 0, 'active'),

('Men''s Cuban Link Chain',
 'mens-cuban-link-chain', 'SJ-MC-003', 9,
 'A heavy 22K gold Cuban link chain.',
 'A statement Cuban link chain in solid 22K gold. A bold piece for the confident man.',
 950000.00, 895000.00, 750000.00, 5, 2, '22K Gold', '68g', '24 inch', NULL, 'men', 1, 'active'),

('Men''s Gold Bracelet',
 'mens-gold-bracelet', 'SJ-MB-001', 10,
 'A sturdy 22K gold bracelet for men.',
 'A classic men''s bracelet in 22K gold with a secure clasp. Built for everyday wear.',
 320000.00, 305000.00, 250000.00, 8, 3, '22K Gold', '24g', '8.5 inch', NULL, 'men', 0, 'active'),

('Men''s Leather & Gold Bracelet',
 'mens-leather-gold-bracelet', 'SJ-MB-002', 10,
 'A modern bracelet combining leather and 18K gold.',
 'A contemporary men''s bracelet with genuine leather and 18K gold accents. Casual yet refined.',
 85000.00, 78000.00, 60000.00, 22, 5, 'Leather & 18K Gold', '12g', '8.5 inch', NULL, 'men', 0, 'active'),

('Men''s Diamond Cufflinks',
 'mens-diamond-cufflinks', 'SJ-MCL-001', 11,
 'Elegant diamond cufflinks in 18K gold.',
 'Sophisticated cufflinks featuring brilliant diamonds set in 18K gold. Perfect for formal occasions.',
 195000.00, NULL, 150000.00, 10, 3, '18K Gold', '9g', 'Standard', '0.2ct Diamonds', 'men', 0, 'active'),

('Men''s Gold Cufflinks',
 'mens-gold-cufflinks', 'SJ-MCL-002', 11,
 'Classic 18K gold cufflinks.',
 'Timeless 18K gold cufflinks with a polished finish. An essential for the well-dressed gentleman.',
 125000.00, 115000.00, 95000.00, 16, 4, '18K Gold', '8.5g', 'Standard', NULL, 'men', 0, 'active'),

('Premium Gold Watch',
 'premium-gold-watch', 'SJ-MW-001', 12,
 'A premium gold-plated watch for men.',
 'A sophisticated men''s watch featuring a gold-plated stainless steel case and band. Water-resistant and durable.',
 850000.00, 795000.00, 650000.00, 4, 2, 'Gold Plated Stainless Steel', '145g', '42mm', NULL, 'men', 1, 'active'),

('Men''s Chronograph Watch',
 'mens-chronograph-watch', 'SJ-MW-002', 12,
 'A modern chronograph watch with gold accents.',
 'A stylish chronograph watch featuring gold accents and a premium leather strap. Perfect for the modern professional.',
 425000.00, NULL, 320000.00, 7, 3, 'Stainless Steel & Leather', '120g', '44mm', NULL, 'men', 0, 'active'),

-- ============================================================
-- PRODUCTS — UNISEX / NEW ARRIVALS
-- ============================================================

('Gold Charm Bracelet',
 'gold-charm-bracelet', 'SJ-UN-001', 13,
 'A delicate 18K gold charm bracelet.',
 'A charming 18K gold bracelet with multiple small charms. Personalize it with your favorite charms.',
 145000.00, 135000.00, 110000.00, 18, 5, '18K Gold', '10g', '7 inch', NULL, 'unisex', 0, 'active'),

('Diamond Cross Pendant',
 'diamond-cross-pendant', 'SJ-UN-002', 13,
 'A diamond-studded cross pendant in 18K gold.',
 'A beautiful cross pendant featuring small diamonds set in 18K gold. A meaningful piece for everyday wear.',
 165000.00, NULL, 130000.00, 13, 4, '18K Gold', '5.5g', '18 inch chain', '0.15ct Diamonds', 'unisex', 1, 'active'),

('Anniversary Gift Set',
 'anniversary-gift-set', 'SJ-GS-001', 14,
 'A curated gift set for anniversaries.',
 'A beautiful gift set including a gold pendant, matching earrings, and a personalized message card. Perfect for anniversaries.',
 285000.00, 265000.00, 215000.00, 8, 3, '22K Gold', '18g', 'Set', NULL, 'unisex', 1, 'active'),

('Wedding Gift Set',
 'wedding-gift-set', 'SJ-GS-002', 14,
 'A premium wedding gift set.',
 'An elegant wedding gift set featuring a gold chain and matching bracelet, presented in a luxury gift box.',
 385000.00, NULL, 305000.00, 6, 3, '22K Gold', '26g', 'Set', NULL, 'unisex', 0, 'active');

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT id, CONCAT('/images/products/', slug, '-1.jpg'), name, 1, 1 FROM products
UNION ALL
SELECT id, CONCAT('/images/products/', slug, '-2.jpg'), CONCAT(name, ' view 2'), 0, 2 FROM products
UNION ALL
SELECT id, CONCAT('/images/products/', slug, '-3.jpg'), CONCAT(name, ' view 3'), 0, 3 FROM products;

-- ============================================================
-- SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('store_name',              'Shoaib Jewellers',        'store'),
('store_email',             'info@shoaibjewellers.com','store'),
('store_phone',             '+92-300-1234567',         'store'),
('store_address',           'Gold Souk, Karachi, Pakistan', 'store'),
('currency',                'PKR',                     'store'),
('shipping_fee',            '500',                     'store'),
('free_shipping_threshold', '100000',                  'store'),
('cod_enabled',             '1',                       'order'),
('min_order_amount',        '5000',                    'order'),
('max_order_amount',        '5000000',                 'order'),
('meta_title',              'Shoaib Jewellers | Premium Jewellery', 'website'),
('meta_description',        'Discover timeless jewellery crafted with precision, elegance, and exceptional craftsmanship.', 'website'),
('social_facebook',         'https://facebook.com/shoaibjewellers', 'website'),
('social_instagram',        'https://instagram.com/shoaibjewellers', 'website'),
('social_twitter',          'https://twitter.com/shoaibjewellers', 'website');