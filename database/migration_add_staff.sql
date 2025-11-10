-- Migration: Add Staff Functionality
-- Run this after the main schema.sql

USE hotel_booking;

-- Update users table to include 'staff' role
ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'admin', 'staff') DEFAULT 'customer';

-- Update rooms table to include new statuses
ALTER TABLE rooms MODIFY COLUMN status ENUM('available', 'unavailable', 'maintenance', 'occupied', 'cleaning') DEFAULT 'available';

-- Create room_staff_assignments table
CREATE TABLE IF NOT EXISTS room_staff_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  staff_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_assignment (room_id, staff_id),
  INDEX idx_staff_id (staff_id),
  INDEX idx_room_id (room_id)
);

