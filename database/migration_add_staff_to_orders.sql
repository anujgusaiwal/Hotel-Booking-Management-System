-- Migration: Add staff assignment to food orders
-- Run this after migration_add_food_ordering.sql

USE hotel_booking;

-- Add staff_id column to food_orders table
ALTER TABLE food_orders 
ADD COLUMN staff_id INT NULL AFTER room_id,
ADD FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL,
ADD INDEX idx_staff_id (staff_id);

