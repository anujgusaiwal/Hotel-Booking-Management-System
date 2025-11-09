-- Migration: Add room_type column to rooms table
-- Run this script to add room_type support to existing database

USE hotel_booking;

-- Add room_type column if it doesn't exist
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS room_type VARCHAR(50) DEFAULT 'standard' AFTER title;

-- Update existing rooms with appropriate types based on their titles
UPDATE rooms SET room_type = 'suite' WHERE title LIKE '%Suite%' OR title LIKE '%suite%';
UPDATE rooms SET room_type = 'family' WHERE title LIKE '%Family%' OR title LIKE '%family%';
UPDATE rooms SET room_type = 'economy' WHERE title LIKE '%Economy%' OR title LIKE '%economy%' OR title LIKE '%Single%' OR title LIKE '%single%';
UPDATE rooms SET room_type = 'deluxe' WHERE title LIKE '%Deluxe%' OR title LIKE '%deluxe%';
UPDATE rooms SET room_type = 'executive' WHERE title LIKE '%Executive%' OR title LIKE '%executive%';
UPDATE rooms SET room_type = 'penthouse' WHERE title LIKE '%Penthouse%' OR title LIKE '%penthouse%';
UPDATE rooms SET room_type = 'standard' WHERE room_type IS NULL OR room_type = '';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_room_type ON rooms(room_type);

