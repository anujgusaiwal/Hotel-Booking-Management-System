# Database Schema Documentation

## Hotel Booking Management System - Complete Database Schema

This document provides a comprehensive description of the database schema, including all tables, their attributes, data types, constraints, primary keys, foreign keys, and relationships.

---

## 📊 Database Overview

**Database Name**: `hotel_booking`

**Database Engine**: MySQL 8.0+

**Character Set**: UTF-8

**Collation**: utf8mb4_unicode_ci

---

## 📋 Table Descriptions

### 1. USERS Table

**Purpose**: Stores all system users including customers, administrators, and staff members.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `full_name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email address (used for login) |
| `password` | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| `phone` | VARCHAR(20) | NULL | Contact phone number |
| `role` | ENUM | DEFAULT 'customer' | User role: 'customer', 'admin', 'staff' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key**: `id`

**Unique Constraints**: 
- `email` (UNIQUE)

**Indexes**:
- Primary key index on `id`
- Unique index on `email`

**Sample Data**:
```sql
id | full_name    | email              | password | phone       | role    | created_at
1  | Admin User   | admin@hotel.com    | $2b$...  | 1234567890  | admin   | 2024-01-01
2  | John Doe     | john@example.com   | $2b$...  | 1234567891  | customer| 2024-01-02
```

---

### 2. ROOMS Table

**Purpose**: Stores information about hotel rooms including details, pricing, and availability.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique room identifier |
| `room_number` | VARCHAR(50) | UNIQUE | Physical room number (e.g., "101", "ROOM-1") |
| `title` | VARCHAR(255) | NOT NULL | Room title/name |
| `room_type` | VARCHAR(50) | DEFAULT 'standard' | Room type: standard, deluxe, suite, family, economy, executive, penthouse |
| `description` | TEXT | NULL | Detailed room description |
| `capacity` | INT | NOT NULL | Maximum number of guests |
| `price_per_night` | DECIMAL(10,2) | NOT NULL | Room rate per night (in INR) |
| `features` | JSON | NULL | Room amenities (WiFi, TV, AC, Minibar, Balcony, etc.) |
| `status` | ENUM | DEFAULT 'available' | Room status: 'available', 'unavailable', 'maintenance', 'occupied', 'cleaning' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key**: `id`

**Unique Constraints**: 
- `room_number` (UNIQUE)

**Indexes**:
- Primary key index on `id`
- Unique index on `room_number`
- Index on `status` (idx_room_status)
- Index on `room_type` (idx_room_type)

**Sample Data**:
```sql
id | room_number | title         | room_type | capacity | price_per_night | status
1  | ROOM-1      | Deluxe Suite  | deluxe    | 2        | 12450.00        | available
2  | ROOM-2      | Standard Double| standard | 2        | 6640.00         | available
```

**JSON Features Example**:
```json
{
  "wifi": true,
  "tv": true,
  "ac": true,
  "minibar": true,
  "balcony": true,
  "jacuzzi": false
}
```

---

### 3. ROOM_IMAGES Table

**Purpose**: Stores image URLs/paths associated with rooms.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique image identifier |
| `room_id` | INT | NOT NULL, FOREIGN KEY | Reference to rooms table |
| `url` | VARCHAR(500) | NOT NULL | Image URL or file path |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

**Primary Key**: `id`

**Foreign Keys**:
- `room_id` → `rooms(id)` ON DELETE CASCADE

**Indexes**:
- Primary key index on `id`
- Index on `room_id` (foreign key)

**Sample Data**:
```sql
id | room_id | url                          | created_at
1  | 1       | /images/rooms/deluxe-1.jpg   | 2024-01-01
2  | 1       | /images/rooms/deluxe-2.jpg   | 2024-01-01
```

---

### 4. BOOKINGS Table

**Purpose**: Stores customer booking information including dates, amounts, and payment status.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique booking identifier |
| `user_id` | INT | NOT NULL, FOREIGN KEY | Reference to users table (customer) |
| `room_id` | INT | NOT NULL, FOREIGN KEY | Reference to rooms table |
| `from_date` | DATE | NOT NULL | Check-in date |
| `to_date` | DATE | NOT NULL | Check-out date |
| `guests` | INT | NOT NULL | Number of guests |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Total booking amount |
| `reference` | VARCHAR(50) | UNIQUE, NOT NULL | Booking reference number |
| `status` | ENUM | DEFAULT 'pending' | Booking status: 'pending', 'confirmed', 'cancelled', 'completed' |
| `payment_status` | ENUM | DEFAULT 'pending' | Payment status: 'pending', 'paid', 'failed', 'refunded' |
| `payment_id` | VARCHAR(255) | NULL | Payment transaction ID |
| `payment_gateway_order_id` | VARCHAR(255) | NULL | Payment gateway order identifier (Future Enhancement) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key**: `id`

**Foreign Keys**:
- `user_id` → `users(id)` ON DELETE CASCADE
- `room_id` → `rooms(id)` ON DELETE CASCADE

**Unique Constraints**: 
- `reference` (UNIQUE)

**Indexes**:
- Primary key index on `id`
- Unique index on `reference`
- Index on `user_id` (idx_booking_user)
- Index on `room_id` (idx_booking_room)
- Index on `status` (idx_booking_status)
- Index on `from_date, to_date` (idx_booking_dates)
- Index on `payment_status` (idx_booking_payment_status)
- Index on `payment_gateway_order_id` (idx_booking_payment_gateway_order)

**Sample Data**:
```sql
id | user_id | room_id | from_date  | to_date    | guests | total_amount | reference | status
1  | 2       | 1       | 2024-01-15 | 2024-01-17 | 2      | 24900.00     | ABC12     | confirmed
```

---

### 5. REVIEWS Table

**Purpose**: Stores customer reviews and ratings for rooms.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique review identifier |
| `user_id` | INT | NOT NULL, FOREIGN KEY | Reference to users table |
| `room_id` | INT | NOT NULL, FOREIGN KEY | Reference to rooms table |
| `rating` | INT | NOT NULL, CHECK (1-5) | Rating value (1 to 5 stars) |
| `comment` | TEXT | NULL | Review text/comment |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Review creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key**: `id`

**Foreign Keys**:
- `user_id` → `users(id)` ON DELETE CASCADE
- `room_id` → `rooms(id)` ON DELETE CASCADE

**Check Constraints**:
- `rating` must be between 1 and 5

**Indexes**:
- Primary key index on `id`
- Index on `user_id` (foreign key)
- Index on `room_id` (foreign key)

**Sample Data**:
```sql
id | user_id | room_id | rating | comment                    | created_at
1  | 2       | 1       | 5      | Excellent room and service! | 2024-01-20
```

---

### 6. FOOD_MENU Table

**Purpose**: Stores food menu items available for room service.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique menu item identifier |
| `name` | VARCHAR(255) | NOT NULL | Dish name |
| `description` | TEXT | NULL | Dish description |
| `price` | DECIMAL(10,2) | NOT NULL | Dish price (in INR) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key**: `id`

**Indexes**:
- Primary key index on `id`
- Index on `name` (idx_name)

**Sample Data**:
```sql
id | name                | description                    | price
1  | Paneer Butter Masala| Creamy tomato gravy with paneer| 250.00
2  | Butter Chicken      | Rich and creamy chicken curry  | 300.00
```

---

### 7. FOOD_ORDERS Table

**Purpose**: Stores food order information including customer, room, items, and status.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| `customer_id` | INT | NOT NULL, FOREIGN KEY | Reference to users table (customer) |
| `room_id` | INT | NOT NULL, FOREIGN KEY | Reference to rooms table |
| `staff_id` | INT | NULL, FOREIGN KEY | Reference to users table (assigned staff) |
| `dish_id` | INT | NOT NULL, FOREIGN KEY | Reference to food_menu table |
| `quantity` | INT | NOT NULL, DEFAULT 1 | Number of items ordered |
| `total_price` | DECIMAL(10,2) | NOT NULL | Total order amount |
| `status` | ENUM | DEFAULT 'pending' | Order status: 'pending', 'preparing', 'delivered', 'cancelled' |
| `payment_status` | ENUM | DEFAULT 'pending' | Payment status: 'pending', 'paid', 'failed', 'refunded' |
| `payment_id` | VARCHAR(255) | NULL | Payment transaction ID |
| `payment_gateway_order_id` | VARCHAR(255) | NULL | Payment gateway order identifier (Future Enhancement) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key**: `id`

**Foreign Keys**:
- `customer_id` → `users(id)` ON DELETE CASCADE
- `room_id` → `rooms(id)` ON DELETE CASCADE
- `staff_id` → `users(id)` ON DELETE SET NULL
- `dish_id` → `food_menu(id)` ON DELETE CASCADE

**Indexes**:
- Primary key index on `id`
- Index on `customer_id` (idx_customer)
- Index on `room_id` (idx_room)
- Index on `staff_id` (idx_staff_id)
- Index on `status` (idx_status)
- Index on `created_at` (idx_created_at)
- Index on `payment_status` (idx_food_order_payment_status)
- Index on `payment_gateway_order_id` (idx_food_order_payment_gateway_order)

**Sample Data**:
```sql
id | customer_id | room_id | staff_id | dish_id | quantity | total_price | status
1  | 2          | 1       | 3        | 1       | 2        | 500.00      | preparing
```

---

### 8. ROOM_STAFF_ASSIGNMENTS Table

**Purpose**: Tracks staff assignments to specific rooms.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique assignment identifier |
| `room_id` | INT | NOT NULL, FOREIGN KEY | Reference to rooms table |
| `staff_id` | INT | NOT NULL, FOREIGN KEY | Reference to users table (staff) |
| `assigned_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Assignment timestamp |
| `assigned_by` | INT | NULL, FOREIGN KEY | Reference to users table (admin who assigned) |

**Primary Key**: `id`

**Foreign Keys**:
- `room_id` → `rooms(id)` ON DELETE CASCADE
- `staff_id` → `users(id)` ON DELETE CASCADE
- `assigned_by` → `users(id)` ON DELETE SET NULL

**Unique Constraints**: 
- `(room_id, staff_id)` (UNIQUE) - Prevents duplicate assignments

**Indexes**:
- Primary key index on `id`
- Unique index on `(room_id, staff_id)`
- Index on `staff_id` (idx_staff_id)
- Index on `room_id` (idx_room_id)

**Sample Data**:
```sql
id | room_id | staff_id | assigned_by | assigned_at
1  | 1       | 3        | 1           | 2024-01-10
```

---

## 🔗 Foreign Key Relationships Summary

| Child Table | Foreign Key Column | Parent Table | Parent Column | Delete Action |
|------------|-------------------|--------------|---------------|---------------|
| `room_images` | `room_id` | `rooms` | `id` | CASCADE |
| `bookings` | `user_id` | `users` | `id` | CASCADE |
| `bookings` | `room_id` | `rooms` | `id` | CASCADE |
| `reviews` | `user_id` | `users` | `id` | CASCADE |
| `reviews` | `room_id` | `rooms` | `id` | CASCADE |
| `food_orders` | `customer_id` | `users` | `id` | CASCADE |
| `food_orders` | `room_id` | `rooms` | `id` | CASCADE |
| `food_orders` | `staff_id` | `users` | `id` | SET NULL |
| `food_orders` | `dish_id` | `food_menu` | `id` | CASCADE |
| `room_staff_assignments` | `room_id` | `rooms` | `id` | CASCADE |
| `room_staff_assignments` | `staff_id` | `users` | `id` | CASCADE |
| `room_staff_assignments` | `assigned_by` | `users` | `id` | SET NULL |

---

## 📊 Indexes Summary

### Performance Indexes

| Table | Index Name | Columns | Purpose |
|-------|-----------|---------|---------|
| `rooms` | `idx_room_status` | `status` | Fast status filtering |
| `rooms` | `idx_room_type` | `room_type` | Fast type filtering |
| `rooms` | `idx_room_number` | `room_number` | Fast room lookup |
| `bookings` | `idx_booking_dates` | `from_date, to_date` | Date range queries |
| `bookings` | `idx_booking_user` | `user_id` | User booking queries |
| `bookings` | `idx_booking_room` | `room_id` | Room booking queries |
| `bookings` | `idx_booking_status` | `status` | Status filtering |
| `bookings` | `idx_booking_payment_status` | `payment_status` | Payment queries |
| `food_orders` | `idx_customer` | `customer_id` | Customer order queries |
| `food_orders` | `idx_status` | `status` | Order status filtering |
| `food_menu` | `idx_name` | `name` | Menu item search |

---

## 🔒 Constraints Summary

### Primary Keys
- All tables have `id` as PRIMARY KEY with AUTO_INCREMENT

### Unique Constraints
- `users.email` - Email must be unique
- `rooms.room_number` - Room number must be unique
- `bookings.reference` - Booking reference must be unique
- `room_staff_assignments(room_id, staff_id)` - No duplicate assignments

### Check Constraints
- `reviews.rating` - Must be between 1 and 5

### NOT NULL Constraints
- Critical fields like `email`, `password`, `title`, `price_per_night`, etc. are NOT NULL

### Default Values
- `role` defaults to 'customer'
- `status` fields have appropriate defaults
- Timestamps auto-populate

---

## 📈 Database Statistics

- **Total Tables**: 8
- **Total Foreign Keys**: 12
- **Total Indexes**: 20+
- **Normalization Level**: 3NF (Third Normal Form)
- **Character Set**: UTF-8 (utf8mb4)

---

## 🔄 Data Integrity Rules

1. **Referential Integrity**: All foreign keys maintain referential integrity
2. **Cascade Deletes**: Related records are deleted when parent is deleted (where appropriate)
3. **Set NULL**: Optional relationships set to NULL when parent is deleted
4. **Unique Constraints**: Prevent duplicate entries where required
5. **Check Constraints**: Ensure valid data ranges
6. **NOT NULL**: Prevent missing critical data

---

## 📝 Notes

- All monetary values are stored as DECIMAL(10,2) for precision
- Dates are stored as DATE type for date-only values
- Timestamps use TIMESTAMP type with automatic updates
- JSON type is used for flexible room features storage
- ENUM types are used for fixed value sets (status, role, etc.)
- Indexes are strategically placed for query optimization
- Foreign keys ensure data consistency across tables

