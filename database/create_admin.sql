-- Create or update admin user
-- This script ensures the admin user exists in the database

USE hotel_booking;

-- Check if admin user exists, if not, create it
-- Password: admin123
INSERT INTO users (full_name, email, password, phone, role) 
VALUES ('Admin User', 'admin@hotel.com', '$2b$10$3kW13AsDN2uC5wmNelVREuUG0iK10zVluz1B8p5SBs1HsOLOracOu', '1234567890', 'admin')
ON DUPLICATE KEY UPDATE 
  full_name = 'Admin User',
  password = '$2b$10$3kW13AsDN2uC5wmNelVREuUG0iK10zVluz1B8p5SBs1HsOLOracOu',
  role = 'admin';

-- If you want to make an existing user an admin, use this:
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

