-- Migration: Add room_type column to rooms table
-- Run this script to add room_type support to existing database
-- Note: If you already ran schema.sql, the room_type column already exists

USE hotel_booking;

-- Disable safe update mode temporarily to allow updates
SET SQL_SAFE_UPDATES = 0;

-- Add room_type column only if it doesn't exist
-- MySQL doesn't support IF NOT EXISTS for ADD COLUMN, so we use a stored procedure
DELIMITER $$

DROP PROCEDURE IF EXISTS AddRoomTypeColumnIfNotExists$$

CREATE PROCEDURE AddRoomTypeColumnIfNotExists()
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO column_exists
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'rooms'
    AND COLUMN_NAME = 'room_type';
    
    IF column_exists = 0 THEN
        ALTER TABLE rooms 
        ADD COLUMN room_type VARCHAR(50) DEFAULT 'standard' AFTER title;
    END IF;
END$$

DELIMITER ;

CALL AddRoomTypeColumnIfNotExists();

DROP PROCEDURE IF EXISTS AddRoomTypeColumnIfNotExists;

-- Update existing rooms with appropriate types based on their titles
UPDATE rooms SET room_type = 'suite' WHERE title LIKE '%Suite%' OR title LIKE '%suite%';
UPDATE rooms SET room_type = 'family' WHERE title LIKE '%Family%' OR title LIKE '%family%';
UPDATE rooms SET room_type = 'economy' WHERE title LIKE '%Economy%' OR title LIKE '%economy%' OR title LIKE '%Single%' OR title LIKE '%single%';
UPDATE rooms SET room_type = 'deluxe' WHERE title LIKE '%Deluxe%' OR title LIKE '%deluxe%';
UPDATE rooms SET room_type = 'executive' WHERE title LIKE '%Executive%' OR title LIKE '%executive%';
UPDATE rooms SET room_type = 'penthouse' WHERE title LIKE '%Penthouse%' OR title LIKE '%penthouse%';
UPDATE rooms SET room_type = 'standard' WHERE room_type IS NULL OR room_type = '';

-- Add index for better query performance (only if it doesn't exist)
DELIMITER $$

DROP PROCEDURE IF EXISTS AddRoomTypeIndexIfNotExists$$

CREATE PROCEDURE AddRoomTypeIndexIfNotExists()
BEGIN
    DECLARE index_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO index_exists
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'rooms'
    AND INDEX_NAME = 'idx_room_type';
    
    IF index_exists = 0 THEN
        CREATE INDEX idx_room_type ON rooms(room_type);
    END IF;
END$$

DELIMITER ;

CALL AddRoomTypeIndexIfNotExists();

DROP PROCEDURE IF EXISTS AddRoomTypeIndexIfNotExists;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

