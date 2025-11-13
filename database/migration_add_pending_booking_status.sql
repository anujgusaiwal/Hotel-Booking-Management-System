-- Migration: Add 'pending' status to bookings table
-- Run this before migration_add_payment.sql if you want to track unpaid bookings

USE hotel_booking;

-- Modify bookings table to add 'pending' status
ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending';

