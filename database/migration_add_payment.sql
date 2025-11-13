-- Migration: Add Payment Gateway Support
-- Run this after the main schema.sql and other migrations
-- Note: Run migration_add_pending_booking_status.sql first if you want to track unpaid bookings
-- If columns already exist, you may see errors which can be safely ignored

USE hotel_booking;

-- Add payment fields to bookings table
ALTER TABLE bookings 
ADD COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
ADD COLUMN payment_id VARCHAR(255) NULL,
ADD COLUMN razorpay_order_id VARCHAR(255) NULL;

-- Add payment fields to food_orders table
ALTER TABLE food_orders 
ADD COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
ADD COLUMN payment_id VARCHAR(255) NULL,
ADD COLUMN razorpay_order_id VARCHAR(255) NULL;

-- Add indexes for payment queries
CREATE INDEX idx_booking_payment_status ON bookings(payment_status);
CREATE INDEX idx_booking_razorpay_order ON bookings(razorpay_order_id);
CREATE INDEX idx_food_order_payment_status ON food_orders(payment_status);
CREATE INDEX idx_food_order_razorpay_order ON food_orders(razorpay_order_id);
