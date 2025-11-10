-- Verification script for staff assignment in food orders
-- Run this to check if staff_id column exists and see recent orders

USE hotel_booking;

-- Check if staff_id column exists in food_orders table
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'hotel_booking'
AND TABLE_NAME = 'food_orders'
AND COLUMN_NAME = 'staff_id';

-- Show recent food orders with staff assignment
SELECT 
    fo.id,
    fo.customer_id,
    fo.room_id,
    fo.staff_id,
    fo.dish_id,
    fo.quantity,
    fo.status,
    fo.created_at,
    r.room_number,
    r.title as room_title,
    u.full_name as customer_name,
    staff.full_name as staff_name,
    staff.email as staff_email
FROM food_orders fo
LEFT JOIN rooms r ON fo.room_id = r.id
LEFT JOIN users u ON fo.customer_id = u.id
LEFT JOIN users staff ON fo.staff_id = staff.id
ORDER BY fo.created_at DESC
LIMIT 10;

-- Show room-staff assignments
SELECT 
    rsa.id,
    rsa.room_id,
    rsa.staff_id,
    r.room_number,
    r.title as room_title,
    u.full_name as staff_name,
    u.email as staff_email,
    rsa.assigned_at
FROM room_staff_assignments rsa
JOIN rooms r ON rsa.room_id = r.id
JOIN users u ON rsa.staff_id = u.id
ORDER BY rsa.assigned_at DESC;

