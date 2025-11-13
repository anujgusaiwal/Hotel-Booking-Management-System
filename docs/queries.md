# SQL Queries Documentation

## Hotel Booking Management System - Sample SQL Queries

This document contains sample SQL queries used in the Hotel Booking Management System, categorized by operation type.

---

## 📝 Table of Contents

1. [INSERT Queries](#insert-queries)
2. [SELECT Queries](#select-queries)
3. [JOIN Queries](#join-queries)
4. [UPDATE Queries](#update-queries)
5. [DELETE Queries](#delete-queries)
6. [Aggregate Queries](#aggregate-queries)
7. [Complex Queries](#complex-queries)
8. [Stored Procedures](#stored-procedures)
9. [Triggers](#triggers)
10. [Views](#views)

---

## 1. INSERT Queries

### 1.1 Insert New User (Customer Registration)

```sql
INSERT INTO users (full_name, email, password, phone, role) 
VALUES ('John Doe', 'john@example.com', '$2b$10$hashedpassword', '1234567890', 'customer');
```

### 1.2 Insert New Room

```sql
INSERT INTO rooms (room_number, title, room_type, description, capacity, price_per_night, features, status) 
VALUES (
    'ROOM-101', 
    'Deluxe Suite', 
    'deluxe', 
    'Spacious suite with king-size bed and city view', 
    2, 
    12450.00, 
    '{"wifi": true, "tv": true, "ac": true, "minibar": true, "balcony": true}', 
    'available'
);
```

### 1.3 Insert Room Image

```sql
INSERT INTO room_images (room_id, url) 
VALUES (1, '/images/rooms/deluxe-suite-1.jpg');
```

### 1.4 Create Booking

```sql
INSERT INTO bookings (user_id, room_id, from_date, to_date, guests, total_amount, reference, status, payment_status) 
VALUES (
    2, 
    1, 
    '2024-01-15', 
    '2024-01-17', 
    2, 
    24900.00, 
    'BOOK123', 
    'confirmed', 
    'paid'
);
```

### 1.5 Insert Food Menu Item

```sql
INSERT INTO food_menu (name, description, price) 
VALUES ('Paneer Butter Masala', 'Creamy tomato gravy with paneer', 250.00);
```

### 1.6 Place Food Order

```sql
INSERT INTO food_orders (customer_id, room_id, dish_id, quantity, total_price, status, payment_status) 
VALUES (2, 1, 1, 2, 500.00, 'pending', 'pending');
```

### 1.7 Insert Review

```sql
INSERT INTO reviews (user_id, room_id, rating, comment) 
VALUES (2, 1, 5, 'Excellent room with great amenities!');
```

### 1.8 Assign Staff to Room

```sql
INSERT INTO room_staff_assignments (room_id, staff_id, assigned_by) 
VALUES (1, 3, 1);
```

---

## 2. SELECT Queries

### 2.1 Select All Available Rooms

```sql
SELECT id, room_number, title, room_type, capacity, price_per_night, status 
FROM rooms 
WHERE status = 'available';
```

### 2.2 Select Rooms by Type

```sql
SELECT * FROM rooms 
WHERE room_type = 'deluxe' AND status = 'available';
```

### 2.3 Select User by Email

```sql
SELECT id, full_name, email, role 
FROM users 
WHERE email = 'john@example.com';
```

### 2.4 Select User Bookings

```sql
SELECT id, reference, from_date, to_date, total_amount, status 
FROM bookings 
WHERE user_id = 2 
ORDER BY created_at DESC;
```

### 2.5 Select Room with Images

```sql
SELECT r.*, ri.url as image_url 
FROM rooms r 
LEFT JOIN room_images ri ON r.id = ri.room_id 
WHERE r.id = 1;
```

### 2.6 Select Available Rooms for Date Range

```sql
SELECT r.* 
FROM rooms r 
WHERE r.status = 'available' 
AND r.id NOT IN (
    SELECT room_id 
    FROM bookings 
    WHERE status != 'cancelled' 
    AND (
        (from_date <= '2024-01-20' AND to_date > '2024-01-18') 
        OR (from_date < '2024-01-22' AND to_date >= '2024-01-20')
    )
);
```

### 2.7 Select Food Menu Items

```sql
SELECT id, name, description, price 
FROM food_menu 
ORDER BY name;
```

### 2.8 Select Pending Food Orders

```sql
SELECT * FROM food_orders 
WHERE status = 'pending' 
ORDER BY created_at ASC;
```

---

## 3. JOIN Queries

### 3.1 Get Booking Details with User and Room Information

```sql
SELECT 
    b.id,
    b.reference,
    b.from_date,
    b.to_date,
    b.total_amount,
    b.status,
    u.full_name as customer_name,
    u.email as customer_email,
    r.room_number,
    r.title as room_title,
    r.room_type
FROM bookings b
INNER JOIN users u ON b.user_id = u.id
INNER JOIN rooms r ON b.room_id = r.id
WHERE b.id = 1;
```

### 3.2 Get All Bookings with Customer and Room Details

```sql
SELECT 
    b.id,
    b.reference,
    b.from_date,
    b.to_date,
    b.guests,
    b.total_amount,
    b.status,
    b.payment_status,
    u.full_name as customer_name,
    u.email,
    r.room_number,
    r.title as room_title,
    r.room_type
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN rooms r ON b.room_id = r.id
ORDER BY b.created_at DESC;
```

### 3.3 Get Room Details with All Images

```sql
SELECT 
    r.id,
    r.room_number,
    r.title,
    r.room_type,
    r.description,
    r.capacity,
    r.price_per_night,
    r.features,
    r.status,
    GROUP_CONCAT(ri.url) as images
FROM rooms r
LEFT JOIN room_images ri ON r.id = ri.room_id
WHERE r.id = 1
GROUP BY r.id;
```

### 3.4 Get Food Order Details with Customer, Room, Dish, and Staff

```sql
SELECT 
    fo.id,
    fo.quantity,
    fo.total_price,
    fo.status,
    fo.payment_status,
    fo.created_at,
    c.full_name as customer_name,
    r.room_number,
    r.title as room_title,
    fm.name as dish_name,
    fm.price as dish_price,
    s.full_name as staff_name
FROM food_orders fo
INNER JOIN users c ON fo.customer_id = c.id
INNER JOIN rooms r ON fo.room_id = r.id
INNER JOIN food_menu fm ON fo.dish_id = fm.id
LEFT JOIN users s ON fo.staff_id = s.id
ORDER BY fo.created_at DESC;
```

### 3.5 Get Room Reviews with User Information

```sql
SELECT 
    r.id as review_id,
    r.rating,
    r.comment,
    r.created_at,
    u.full_name as reviewer_name,
    rm.room_number,
    rm.title as room_title
FROM reviews r
INNER JOIN users u ON r.user_id = u.id
INNER JOIN rooms rm ON r.room_id = rm.id
WHERE r.room_id = 1
ORDER BY r.created_at DESC;
```

### 3.6 Get Staff Assignments with Room and Staff Details

```sql
SELECT 
    rsa.id,
    rsa.assigned_at,
    r.room_number,
    r.title as room_title,
    r.status as room_status,
    s.full_name as staff_name,
    s.email as staff_email,
    a.full_name as assigned_by_name
FROM room_staff_assignments rsa
INNER JOIN rooms r ON rsa.room_id = r.id
INNER JOIN users s ON rsa.staff_id = s.id
LEFT JOIN users a ON rsa.assigned_by = a.id
ORDER BY rsa.assigned_at DESC;
```

---

## 4. UPDATE Queries

### 4.1 Update Room Status

```sql
UPDATE rooms 
SET status = 'occupied' 
WHERE id = 1;
```

### 4.2 Update Booking Status

```sql
UPDATE bookings 
SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### 4.3 Update Booking Payment Status

```sql
UPDATE bookings 
SET payment_status = 'paid', 
    payment_id = 'pay_1234567890',
    payment_gateway_order_id = 'order_1234567890',
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### 4.4 Update Food Order Status

```sql
UPDATE food_orders 
SET status = 'preparing', 
    staff_id = 3,
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### 4.5 Update Room Price

```sql
UPDATE rooms 
SET price_per_night = 15000.00, 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### 4.6 Update User Profile

```sql
UPDATE users 
SET full_name = 'John Smith', 
    phone = '9876543210',
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 2;
```

### 4.7 Update Food Order to Delivered

```sql
UPDATE food_orders 
SET status = 'delivered', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

---

## 5. DELETE Queries

### 5.1 Delete Room (Cascade deletes related records)

```sql
DELETE FROM rooms WHERE id = 1;
-- This will automatically delete:
-- - Related room_images
-- - Related bookings (if cascade is set)
-- - Related reviews
-- - Related room_staff_assignments
```

### 5.2 Cancel Booking (Soft delete by status update)

```sql
UPDATE bookings 
SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### 5.3 Delete Food Menu Item

```sql
DELETE FROM food_menu WHERE id = 1;
-- Note: Check for existing orders before deletion
```

### 5.4 Delete Room Image

```sql
DELETE FROM room_images WHERE id = 1;
```

### 5.5 Remove Staff Assignment

```sql
DELETE FROM room_staff_assignments 
WHERE room_id = 1 AND staff_id = 3;
```

---

## 6. Aggregate Queries

### 6.1 Count Total Bookings

```sql
SELECT COUNT(*) as total_bookings FROM bookings;
```

### 6.2 Count Bookings by Status

```sql
SELECT status, COUNT(*) as count 
FROM bookings 
GROUP BY status;
```

### 6.3 Calculate Total Revenue

```sql
SELECT SUM(total_amount) as total_revenue 
FROM bookings 
WHERE payment_status = 'paid';
```

### 6.4 Calculate Revenue by Month

```sql
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    SUM(total_amount) as monthly_revenue,
    COUNT(*) as booking_count
FROM bookings 
WHERE payment_status = 'paid'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;
```

### 6.5 Average Room Rating

```sql
SELECT 
    room_id,
    AVG(rating) as average_rating,
    COUNT(*) as review_count
FROM reviews 
GROUP BY room_id;
```

### 6.6 Count Available Rooms by Type

```sql
SELECT 
    room_type,
    COUNT(*) as available_count
FROM rooms 
WHERE status = 'available'
GROUP BY room_type;
```

### 6.7 Total Food Orders Revenue

```sql
SELECT 
    SUM(total_price) as total_food_revenue,
    COUNT(*) as total_orders
FROM food_orders 
WHERE payment_status = 'paid';
```

### 6.8 Most Popular Room Type

```sql
SELECT 
    r.room_type,
    COUNT(b.id) as booking_count,
    SUM(b.total_amount) as revenue
FROM rooms r
INNER JOIN bookings b ON r.id = b.room_id
WHERE b.status != 'cancelled'
GROUP BY r.room_type
ORDER BY booking_count DESC
LIMIT 1;
```

---

## 7. Complex Queries

### 7.1 Get Rooms Available for Specific Date Range

```sql
SELECT 
    r.*,
    (SELECT COUNT(*) FROM bookings b 
     WHERE b.room_id = r.id 
     AND b.status != 'cancelled'
     AND (b.from_date <= '2024-01-20' AND b.to_date > '2024-01-18')
    ) as conflict_count
FROM rooms r
WHERE r.status = 'available'
HAVING conflict_count = 0;
```

### 7.2 Get Customer Booking History with Room Details

```sql
SELECT 
    b.id,
    b.reference,
    b.from_date,
    b.to_date,
    b.total_amount,
    b.status,
    b.payment_status,
    r.room_number,
    r.title,
    r.room_type,
    DATEDIFF(b.to_date, b.from_date) as nights
FROM bookings b
INNER JOIN rooms r ON b.room_id = r.id
WHERE b.user_id = 2
ORDER BY b.created_at DESC;
```

### 7.3 Get Pending Orders with Customer and Room Info

```sql
SELECT 
    fo.id,
    fo.quantity,
    fo.total_price,
    fo.created_at,
    c.full_name as customer_name,
    c.phone as customer_phone,
    r.room_number,
    r.title as room_title,
    fm.name as dish_name,
    fm.price as unit_price
FROM food_orders fo
INNER JOIN users c ON fo.customer_id = c.id
INNER JOIN rooms r ON fo.room_id = r.id
INNER JOIN food_menu fm ON fo.dish_id = fm.id
WHERE fo.status = 'pending'
ORDER BY fo.created_at ASC;
```

### 7.4 Get Room Occupancy Rate

```sql
SELECT 
    r.id,
    r.room_number,
    r.title,
    COUNT(b.id) as total_bookings,
    SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
    SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings
FROM rooms r
LEFT JOIN bookings b ON r.id = b.room_id
GROUP BY r.id, r.room_number, r.title;
```

### 7.5 Get Staff Workload (Assigned Rooms and Orders)

```sql
SELECT 
    u.id,
    u.full_name,
    COUNT(DISTINCT rsa.room_id) as assigned_rooms,
    COUNT(DISTINCT fo.id) as assigned_orders
FROM users u
LEFT JOIN room_staff_assignments rsa ON u.id = rsa.staff_id
LEFT JOIN food_orders fo ON u.id = fo.staff_id AND fo.status != 'delivered'
WHERE u.role = 'staff'
GROUP BY u.id, u.full_name;
```

---

## 8. Stored Procedures

### 8.1 Procedure to Check Room Availability

```sql
DELIMITER $$

CREATE PROCEDURE CheckRoomAvailability(
    IN p_room_id INT,
    IN p_from_date DATE,
    IN p_to_date DATE,
    OUT p_is_available BOOLEAN
)
BEGIN
    DECLARE conflict_count INT;
    
    SELECT COUNT(*) INTO conflict_count
    FROM bookings
    WHERE room_id = p_room_id
    AND status != 'cancelled'
    AND (
        (from_date <= p_to_date AND to_date > p_from_date)
    );
    
    IF conflict_count = 0 THEN
        SET p_is_available = TRUE;
    ELSE
        SET p_is_available = FALSE;
    END IF;
END$$

DELIMITER ;

-- Usage:
-- CALL CheckRoomAvailability(1, '2024-01-15', '2024-01-17', @available);
-- SELECT @available;
```

### 8.2 Procedure to Calculate Booking Total

```sql
DELIMITER $$

CREATE PROCEDURE CalculateBookingTotal(
    IN p_room_id INT,
    IN p_from_date DATE,
    IN p_to_date DATE,
    OUT p_total_amount DECIMAL(10,2),
    OUT p_nights INT
)
BEGIN
    DECLARE v_price_per_night DECIMAL(10,2);
    
    SELECT price_per_night INTO v_price_per_night
    FROM rooms
    WHERE id = p_room_id;
    
    SET p_nights = DATEDIFF(p_to_date, p_from_date);
    SET p_total_amount = v_price_per_night * p_nights;
END$$

DELIMITER ;

-- Usage:
-- CALL CalculateBookingTotal(1, '2024-01-15', '2024-01-17', @total, @nights);
-- SELECT @total, @nights;
```

### 8.3 Procedure to Get Room Statistics

```sql
DELIMITER $$

CREATE PROCEDURE GetRoomStatistics(
    IN p_room_id INT
)
BEGIN
    SELECT 
        r.id,
        r.room_number,
        r.title,
        r.status,
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as confirmed_bookings,
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END) as total_revenue,
        AVG(rev.rating) as average_rating,
        COUNT(DISTINCT rev.id) as review_count
    FROM rooms r
    LEFT JOIN bookings b ON r.id = b.room_id
    LEFT JOIN reviews rev ON r.id = rev.room_id
    WHERE r.id = p_room_id
    GROUP BY r.id, r.room_number, r.title, r.status;
END$$

DELIMITER ;

-- Usage:
-- CALL GetRoomStatistics(1);
```

---

## 9. Triggers

### 9.1 Trigger to Update Room Status on Booking

```sql
DELIMITER $$

CREATE TRIGGER after_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE rooms 
        SET status = 'occupied' 
        WHERE id = NEW.room_id;
    END IF;
END$$

DELIMITER ;
```

### 9.2 Trigger to Generate Booking Reference

```sql
DELIMITER $$

CREATE TRIGGER before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.reference IS NULL OR NEW.reference = '' THEN
        SET NEW.reference = CONCAT('BOOK', LPAD(FLOOR(RAND() * 100000), 5, '0'));
    END IF;
END$$

DELIMITER ;
```

### 9.3 Trigger to Update Room Status on Booking Completion

```sql
DELIMITER $$

CREATE TRIGGER after_booking_update
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE rooms 
        SET status = 'cleaning' 
        WHERE id = NEW.room_id;
    END IF;
    
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE rooms 
        SET status = 'available' 
        WHERE id = NEW.room_id;
    END IF;
END$$

DELIMITER ;
```

---

## 10. Views

### 10.1 View for Active Bookings

```sql
CREATE VIEW active_bookings AS
SELECT 
    b.id,
    b.reference,
    b.from_date,
    b.to_date,
    b.total_amount,
    b.status,
    u.full_name as customer_name,
    u.email as customer_email,
    r.room_number,
    r.title as room_title
FROM bookings b
INNER JOIN users u ON b.user_id = u.id
INNER JOIN rooms r ON b.room_id = r.id
WHERE b.status IN ('pending', 'confirmed')
AND b.from_date >= CURDATE();

-- Usage:
-- SELECT * FROM active_bookings;
```

### 10.2 View for Room Summary

```sql
CREATE VIEW room_summary AS
SELECT 
    r.id,
    r.room_number,
    r.title,
    r.room_type,
    r.capacity,
    r.price_per_night,
    r.status,
    COUNT(DISTINCT b.id) as total_bookings,
    SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END) as total_revenue,
    AVG(rev.rating) as average_rating
FROM rooms r
LEFT JOIN bookings b ON r.id = b.room_id
LEFT JOIN reviews rev ON r.id = rev.room_id
GROUP BY r.id, r.room_number, r.title, r.room_type, r.capacity, r.price_per_night, r.status;

-- Usage:
-- SELECT * FROM room_summary WHERE status = 'available';
```

### 10.3 View for Revenue Report

```sql
CREATE VIEW revenue_report AS
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_bookings,
    SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as revenue,
    SUM(CASE WHEN status = 'cancelled' THEN total_amount ELSE 0 END) as cancelled_amount,
    AVG(total_amount) as average_booking_value
FROM bookings
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- Usage:
-- SELECT * FROM revenue_report;
```

---

## 📊 Query Performance Tips

1. **Use Indexes**: All foreign keys and frequently queried columns are indexed
2. **Limit Results**: Use `LIMIT` clause for pagination
3. **Select Specific Columns**: Avoid `SELECT *` in production
4. **Use JOINs Efficiently**: Prefer INNER JOIN when possible
5. **Date Range Queries**: Use indexed date columns for filtering
6. **Aggregate Functions**: Use GROUP BY with indexed columns

---

## 🔒 Security Considerations

- All queries use parameterized statements to prevent SQL injection
- User input is validated before database operations
- Sensitive data (passwords) is hashed, not stored in plain text
- Access control is enforced at application level based on user roles

