-- Migration: Add Food Ordering System
-- Run this after the main schema.sql

USE hotel_booking;

-- Food Menu table
CREATE TABLE IF NOT EXISTS food_menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Food Orders table
CREATE TABLE IF NOT EXISTS food_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  room_id INT NOT NULL,
  dish_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (dish_id) REFERENCES food_menu(id) ON DELETE CASCADE,
  INDEX idx_customer (customer_id),
  INDEX idx_room (room_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Insert sample Indian menu items
INSERT INTO food_menu (name, description, price) VALUES
('Paneer Butter Masala', 'Creamy tomato gravy with paneer', 250.00),
('Butter Chicken', 'Rich and creamy chicken curry', 300.00),
('Dal Makhani', 'Slow-cooked black lentils', 200.00),
('Veg Biryani', 'Spiced basmati rice with vegetables', 220.00),
('Chicken Biryani', 'Traditional Hyderabadi chicken biryani', 280.00),
('Chole Bhature', 'Punjabi chickpea curry with fried bread', 200.00),
('Garlic Naan', 'Soft naan bread with garlic butter', 50.00),
('Gulab Jamun', 'Sweet milk-based fried dumplings', 100.00);

