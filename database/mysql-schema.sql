-- Run this script in phpMyAdmin after selecting the database you already use.
-- It creates only EnjeraGo-prefixed tables; it does not alter other tables.

CREATE TABLE IF NOT EXISTS enjerago_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY enjerago_users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enjerago_restaurants (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(160) NOT NULL,
  cuisine VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  delivery_time VARCHAR(40) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url VARCHAR(1000) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enjerago_menu_items (
  id VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  KEY enjerago_menu_restaurant_idx (restaurant_id),
  CONSTRAINT enjerago_menu_restaurant_fk
    FOREIGN KEY (restaurant_id) REFERENCES enjerago_restaurants (id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enjerago_orders (
  id CHAR(36) NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  city VARCHAR(120) NOT NULL,
  area VARCHAR(160) NOT NULL,
  street_address VARCHAR(500) NOT NULL,
  instructions VARCHAR(1000) NOT NULL DEFAULT '',
  payment_method VARCHAR(24) NOT NULL DEFAULT 'cod',
  status VARCHAR(32) NOT NULL DEFAULT 'placed',
  subtotal DECIMAL(12,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY enjerago_orders_customer_created_idx (customer_id, created_at),
  CONSTRAINT enjerago_orders_customer_fk
    FOREIGN KEY (customer_id) REFERENCES enjerago_users (id)
    ON DELETE RESTRICT,
  CONSTRAINT enjerago_orders_restaurant_fk
    FOREIGN KEY (restaurant_id) REFERENCES enjerago_restaurants (id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enjerago_order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id CHAR(36) NOT NULL,
  food_id VARCHAR(64) NOT NULL,
  food_name VARCHAR(160) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id),
  KEY enjerago_order_items_order_idx (order_id),
  CONSTRAINT enjerago_order_items_order_fk
    FOREIGN KEY (order_id) REFERENCES enjerago_orders (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO enjerago_restaurants
  (id, name, cuisine, location, rating, delivery_time, delivery_fee, image_url, featured, is_open)
VALUES
  ('addis-kitchen', 'Addis Kitchen', 'Traditional Ethiopian', 'Addis Ababa', 4.8, '25–35 min', 45, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
  ('green-platter', 'The Green Platter', 'Vegetarian & Vegan', 'Addis Ababa', 4.7, '20–30 min', 35, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
  ('coffee-house', 'Habesha Coffee House', 'Coffee & Breakfast', 'Addis Ababa', 4.9, '15–25 min', 30, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', TRUE, TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  cuisine = VALUES(cuisine),
  location = VALUES(location),
  rating = VALUES(rating),
  delivery_time = VALUES(delivery_time),
  delivery_fee = VALUES(delivery_fee),
  image_url = VALUES(image_url),
  featured = VALUES(featured);

INSERT INTO enjerago_menu_items
  (id, restaurant_id, name, description, price, image_url, category, is_available)
VALUES
  ('food-1', 'addis-kitchen', 'Special Beyaynetu', 'A colorful selection of Ethiopian vegetarian dishes.', 220, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800', 'Traditional', TRUE),
  ('food-2', 'addis-kitchen', 'Doro Wot', 'Traditional spicy chicken stew served with injera.', 380, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800', 'Meat Dishes', TRUE),
  ('food-3', 'addis-kitchen', 'Shiro Wot', 'Comforting Ethiopian chickpea stew served with injera.', 180, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800', 'Vegetarian', TRUE),
  ('food-4', 'green-platter', 'Fresh Garden Bowl', 'A fresh mix of vegetables and healthy ingredients.', 250, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'Vegetarian', TRUE),
  ('food-5', 'green-platter', 'Avocado Salad', 'Fresh avocado and seasonal vegetables.', 200, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'Vegetarian', TRUE),
  ('food-6', 'coffee-house', 'Ethiopian Coffee', 'Freshly prepared Ethiopian coffee.', 80, 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', 'Drinks', TRUE),
  ('food-7', 'coffee-house', 'Coffee and Snack Combo', 'Coffee served with a small traditional snack.', 150, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', 'Snacks', TRUE)
ON DUPLICATE KEY UPDATE
  restaurant_id = VALUES(restaurant_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  image_url = VALUES(image_url),
  category = VALUES(category),
  is_available = VALUES(is_available);
