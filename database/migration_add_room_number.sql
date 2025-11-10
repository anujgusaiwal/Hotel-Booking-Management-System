-- Migration: Add Room Number to Rooms Table
-- Run this after the main schema.sql

USE hotel_booking;

-- Add room_number column to rooms table
ALTER TABLE rooms 
ADD COLUMN room_number VARCHAR(50) UNIQUE AFTER id;

-- Create index for room_number for faster lookups
CREATE INDEX idx_room_number ON rooms(room_number);

-- Update existing rooms with default room numbers if they don't have one
-- This sets room numbers as "ROOM-{id}" for existing rooms
UPDATE rooms 
SET room_number = CONCAT('ROOM-', id) 
WHERE room_number IS NULL;

