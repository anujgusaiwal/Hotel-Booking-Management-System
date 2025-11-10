# Hotel Booking Management System - DBMS Viva Questions

---

## 1. Project Overview

### What is the Hotel Booking Management System?

The **Hotel Booking Management System** is a comprehensive web-based application designed to manage hotel operations efficiently. It allows customers to browse and book hotel rooms, enables staff to manage room assignments and status, and provides administrators with complete control over the system.

### Key Features:

- **Room Management**: View, add, update, and delete hotel rooms with details like type, capacity, pricing, and availability
- **Booking System**: Customers can search for available rooms, make bookings, and manage their reservations
- **User Management**: Three distinct roles with different access levels
- **Staff Assignment Module**: Admin can assign staff members to specific rooms for maintenance and service
- **Food Ordering System**: Customers can order food to their booked rooms, with automatic staff assignment

### User Roles:

1. **Admin**: 
   - Full system access
   - Manage rooms, bookings, users, and staff assignments
   - View analytics and reports
   - Manage food menu and orders

2. **Staff**: 
   - View assigned rooms
   - Update room status (available, occupied, cleaning)
   - View bookings for assigned rooms
   - View and manage food orders for assigned rooms

3. **Customer**: 
   - Browse and search rooms
   - Make bookings
   - View booking history
   - Order food to booked rooms
   - View order history

---

## 2. Database Explanation

### Database Name: `hotel_booking`

The database consists of **9 main tables** that store all the information required for the hotel management system.

### Table 1: `users`

**Purpose**: Stores information about all users in the system (customers, staff, and admins).

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique identifier for each user
- `full_name` (VARCHAR(255), NOT NULL): User's full name
- `email` (VARCHAR(255), UNIQUE, NOT NULL): User's email address (unique constraint ensures no duplicates)
- `password` (VARCHAR(255), NOT NULL): Encrypted password for authentication
- `phone` (VARCHAR(20)): Contact phone number (optional)
- `role` (ENUM('customer', 'admin', 'staff')): User's role in the system
- `created_at` (TIMESTAMP): Record creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Key Constraints**:
- Primary Key: `id`
- Unique Key: `email`

---

### Table 2: `rooms`

**Purpose**: Stores information about all hotel rooms available for booking.

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique room identifier
- `room_number` (VARCHAR(50), UNIQUE): Physical room number (e.g., "101", "A-201")
- `title` (VARCHAR(255), NOT NULL): Room name or title
- `room_type` (VARCHAR(50)): Type of room (standard, deluxe, suite, penthouse, etc.)
- `description` (TEXT): Detailed room description
- `capacity` (INT, NOT NULL): Maximum number of guests
- `price_per_night` (DECIMAL(10, 2), NOT NULL): Room price per night
- `features` (JSON): Room amenities stored as JSON (WiFi, TV, AC, etc.)
- `status` (ENUM): Current room status (available, unavailable, maintenance, occupied, cleaning)
- `created_at` (TIMESTAMP): Record creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Key Constraints**:
- Primary Key: `id`
- Unique Key: `room_number`
- Indexes: `status`, `room_type`, `room_number` (for faster queries)

---

### Table 3: `room_images`

**Purpose**: Stores multiple images for each room (one-to-many relationship with rooms).

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique image identifier
- `room_id` (INT, NOT NULL, FOREIGN KEY): References `rooms.id`
- `url` (VARCHAR(500), NOT NULL): Image URL or path
- `created_at` (TIMESTAMP): Record creation timestamp

**Key Constraints**:
- Primary Key: `id`
- Foreign Key: `room_id` → `rooms.id` (ON DELETE CASCADE: if room is deleted, images are deleted)

---

### Table 4: `bookings`

**Purpose**: Stores all room booking transactions made by customers.

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique booking identifier
- `user_id` (INT, NOT NULL, FOREIGN KEY): References `users.id` (customer who made booking)
- `room_id` (INT, NOT NULL, FOREIGN KEY): References `rooms.id` (booked room)
- `from_date` (DATE, NOT NULL): Check-in date
- `to_date` (DATE, NOT NULL): Check-out date
- `guests` (INT, NOT NULL): Number of guests
- `total_amount` (DECIMAL(10, 2), NOT NULL): Total booking amount
- `reference` (VARCHAR(50), UNIQUE, NOT NULL): Unique booking reference number
- `status` (ENUM): Booking status (confirmed, cancelled, completed)
- `created_at` (TIMESTAMP): Booking creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Key Constraints**:
- Primary Key: `id`
- Foreign Keys: `user_id` → `users.id`, `room_id` → `rooms.id` (ON DELETE CASCADE)
- Unique Key: `reference`
- Indexes: `user_id`, `room_id`, `status`, `from_date`, `to_date` (for faster searches)

---

### Table 5: `room_staff_assignments`

**Purpose**: Manages the assignment of staff members to specific rooms for maintenance and service.

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique assignment identifier
- `room_id` (INT, NOT NULL, FOREIGN KEY): References `rooms.id`
- `staff_id` (INT, NOT NULL, FOREIGN KEY): References `users.id` (staff member)
- `assigned_at` (TIMESTAMP): Assignment timestamp
- `assigned_by` (INT, FOREIGN KEY): References `users.id` (admin who made the assignment)

**Key Constraints**:
- Primary Key: `id`
- Foreign Keys: `room_id` → `rooms.id`, `staff_id` → `users.id`, `assigned_by` → `users.id`
- Unique Constraint: `(room_id, staff_id)` - Ensures one staff per room at a time
- Indexes: `room_id`, `staff_id` (for faster lookups)

**Relationship**: Many-to-Many relationship between rooms and staff (one room can have multiple staff assignments over time, one staff can be assigned to multiple rooms)

---

### Table 6: `food_menu`

**Purpose**: Stores the food items available for ordering in the hotel.

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique menu item identifier
- `name` (VARCHAR(255), NOT NULL): Dish name
- `description` (TEXT): Dish description
- `price` (DECIMAL(10, 2), NOT NULL): Price per item
- `created_at` (TIMESTAMP): Record creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Key Constraints**:
- Primary Key: `id`
- Index: `name` (for faster searches)

---

### Table 7: `food_orders`

**Purpose**: Stores all food orders placed by customers to their booked rooms.

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique order identifier
- `customer_id` (INT, NOT NULL, FOREIGN KEY): References `users.id` (customer who placed order)
- `room_id` (INT, NOT NULL, FOREIGN KEY): References `rooms.id` (room where order is delivered)
- `staff_id` (INT, FOREIGN KEY, NULL): References `users.id` (staff assigned to handle order)
- `dish_id` (INT, NOT NULL, FOREIGN KEY): References `food_menu.id` (ordered dish)
- `quantity` (INT, NOT NULL, DEFAULT 1): Number of items ordered
- `total_price` (DECIMAL(10, 2), NOT NULL): Total order amount (quantity × dish price)
- `status` (ENUM): Order status (pending, preparing, delivered, cancelled)
- `created_at` (TIMESTAMP): Order creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Key Constraints**:
- Primary Key: `id`
- Foreign Keys: `customer_id` → `users.id`, `room_id` → `rooms.id`, `dish_id` → `food_menu.id`, `staff_id` → `users.id` (ON DELETE SET NULL)
- Indexes: `customer_id`, `room_id`, `dish_id`, `staff_id`, `status`, `created_at`

**Business Logic**: When a customer places an order, the system automatically assigns it to the staff member currently assigned to that room.

---

### Table 8: `reviews`

**Purpose**: Stores customer reviews and ratings for rooms.

**Attributes**:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique review identifier
- `user_id` (INT, NOT NULL, FOREIGN KEY): References `users.id` (reviewer)
- `room_id` (INT, NOT NULL, FOREIGN KEY): References `rooms.id` (reviewed room)
- `rating` (INT, NOT NULL, CHECK 1-5): Rating from 1 to 5 stars
- `comment` (TEXT): Review comment
- `created_at` (TIMESTAMP): Review creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Key Constraints**:
- Primary Key: `id`
- Foreign Keys: `user_id` → `users.id`, `room_id` → `rooms.id` (ON DELETE CASCADE)
- Check Constraint: `rating >= 1 AND rating <= 5`

---

## 3. SQL Queries Used in the Project

### 3.1 Users Table Queries

#### INSERT Query - Create New User
```sql
INSERT INTO users (full_name, email, password, phone, role) 
VALUES ('John Doe', 'john@example.com', 'hashed_password', '1234567890', 'customer');
```
**Explanation**: This query adds a new user to the database with their name, email, encrypted password, phone number, and role.

#### SELECT Query - Get All Users
```sql
SELECT id, full_name, email, phone, role, created_at 
FROM users 
ORDER BY created_at DESC;
```
**Explanation**: This query retrieves all users from the database, ordered by creation date (newest first), excluding the password field for security.

#### SELECT Query - Get User by Email
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```
**Explanation**: This query finds a specific user by their email address, used for login authentication.

#### UPDATE Query - Update User Information
```sql
UPDATE users 
SET full_name = 'John Smith', phone = '9876543210' 
WHERE id = 1;
```
**Explanation**: This query updates a user's name and phone number based on their user ID.

#### DELETE Query - Delete User
```sql
DELETE FROM users WHERE id = 1;
```
**Explanation**: This query removes a user from the database. Due to CASCADE constraints, related bookings and orders are also deleted.

---

### 3.2 Rooms Table Queries

#### INSERT Query - Add New Room
```sql
INSERT INTO rooms (room_number, title, room_type, description, capacity, price_per_night, status) 
VALUES ('101', 'Deluxe Suite', 'suite', 'Spacious room with ocean view', 2, 5000.00, 'available');
```
**Explanation**: This query adds a new room to the hotel inventory with all its details.

#### SELECT Query - Get Available Rooms
```sql
SELECT * FROM rooms WHERE status = 'available';
```
**Explanation**: This query fetches all rooms that are currently free for booking.

#### SELECT Query - Search Rooms with Filters
```sql
SELECT r.*, 
  (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as images
FROM rooms r
WHERE r.price_per_night >= 3000 
  AND r.price_per_night <= 6000 
  AND r.capacity >= 2 
  AND r.status = 'available'
ORDER BY r.id DESC;
```
**Explanation**: This query searches for rooms matching price range, capacity, and availability filters, and includes room images using a subquery.

#### UPDATE Query - Update Room Status
```sql
UPDATE rooms 
SET status = 'occupied' 
WHERE id = 1;
```
**Explanation**: This query changes a room's status, typically used when a guest checks in.

#### DELETE Query - Delete Room
```sql
DELETE FROM rooms WHERE id = 1;
```
**Explanation**: This query removes a room from the database. CASCADE deletes related images and bookings.

---

### 3.3 Bookings Table Queries

#### INSERT Query - Create New Booking
```sql
INSERT INTO bookings (user_id, room_id, from_date, to_date, guests, total_amount, reference, status) 
VALUES (1, 5, '2025-01-15', '2025-01-18', 2, 15000.00, 'BK123456', 'confirmed');
```
**Explanation**: This query creates a new booking record with customer details, room, dates, and calculated total amount.

#### SELECT Query - Get User's Bookings
```sql
SELECT b.*, r.title as room_title, r.room_number, r.price_per_night
FROM bookings b
JOIN rooms r ON b.room_id = r.id
WHERE b.user_id = 1 
ORDER BY b.created_at DESC;
```
**Explanation**: This query retrieves all bookings for a specific user, joining with rooms table to get room details.

#### SELECT Query - Check Date Conflicts
```sql
SELECT id FROM bookings 
WHERE room_id = 5 
  AND status != 'cancelled'
  AND ((from_date <= '2025-01-15' AND to_date > '2025-01-15') 
    OR (from_date < '2025-01-18' AND to_date >= '2025-01-18'));
```
**Explanation**: This query checks if a room is already booked for overlapping dates, preventing double bookings.

#### UPDATE Query - Update Booking Status
```sql
UPDATE bookings 
SET status = 'cancelled' 
WHERE id = 1;
```
**Explanation**: This query cancels a booking by changing its status, making the room available again.

#### SELECT Query - Get Active Bookings
```sql
SELECT b.*, r.title as room_title, r.room_number
FROM bookings b
JOIN rooms r ON b.room_id = r.id
WHERE b.user_id = 1 
  AND b.status = 'confirmed' 
  AND b.from_date <= CURDATE() 
  AND b.to_date >= CURDATE();
```
**Explanation**: This query finds bookings that are currently active (check-in date passed, check-out date not yet reached).

---

### 3.4 Room-Staff Assignments Table Queries

#### INSERT Query - Assign Staff to Room
```sql
INSERT INTO room_staff_assignments (room_id, staff_id, assigned_by) 
VALUES (5, 3, 1);
```
**Explanation**: This query assigns a staff member to a specific room, recording which admin made the assignment.

#### SELECT Query - Get Staff's Assigned Rooms
```sql
SELECT r.*, rsa.assigned_at
FROM rooms r
JOIN room_staff_assignments rsa ON r.id = rsa.room_id
WHERE rsa.staff_id = 3
ORDER BY rsa.assigned_at DESC;
```
**Explanation**: This query retrieves all rooms assigned to a specific staff member, using INNER JOIN to connect rooms and assignments.

#### SELECT Query - Get Current Room Assignments
```sql
SELECT rsa.*, r.title as room_title, r.room_number, 
       u.full_name as staff_name, u.email as staff_email
FROM room_staff_assignments rsa
JOIN rooms r ON rsa.room_id = r.id
JOIN users u ON rsa.staff_id = u.id
ORDER BY rsa.assigned_at DESC;
```
**Explanation**: This query gets all current staff-room assignments with room and staff details using multiple JOINs.

#### DELETE Query - Unassign Staff from Room
```sql
DELETE FROM room_staff_assignments 
WHERE room_id = 5 AND staff_id = 3;
```
**Explanation**: This query removes a staff assignment from a room.

---

### 3.5 Food Menu Table Queries

#### INSERT Query - Add Food Item
```sql
INSERT INTO food_menu (name, description, price) 
VALUES ('Butter Chicken', 'Rich and creamy chicken curry', 300.00);
```
**Explanation**: This query adds a new food item to the menu with its name, description, and price.

#### SELECT Query - Get All Menu Items
```sql
SELECT * FROM food_menu ORDER BY name ASC;
```
**Explanation**: This query retrieves all food items from the menu, sorted alphabetically by name.

#### UPDATE Query - Update Food Item Price
```sql
UPDATE food_menu 
SET price = 350.00 
WHERE id = 1;
```
**Explanation**: This query updates the price of a specific food item.

#### DELETE Query - Remove Food Item
```sql
DELETE FROM food_menu WHERE id = 1;
```
**Explanation**: This query removes a food item from the menu. CASCADE deletes related orders.

---

### 3.6 Food Orders Table Queries

#### INSERT Query - Place Food Order
```sql
INSERT INTO food_orders (customer_id, room_id, staff_id, dish_id, quantity, total_price, status) 
VALUES (1, 5, 3, 2, 2, 600.00, 'pending');
```
**Explanation**: This query creates a new food order, automatically assigning it to the staff member responsible for that room.

#### SELECT Query - Get Customer's Orders
```sql
SELECT fo.*, 
  fm.name as dish_name, fm.price as dish_price,
  r.title as room_title, r.room_number,
  staff.full_name as staff_name
FROM food_orders fo
JOIN food_menu fm ON fo.dish_id = fm.id
JOIN rooms r ON fo.room_id = r.id
LEFT JOIN users staff ON fo.staff_id = staff.id
WHERE fo.customer_id = 1
ORDER BY fo.created_at DESC;
```
**Explanation**: This query retrieves all orders for a customer, joining with menu, rooms, and staff tables to get complete order details.

#### SELECT Query - Get Staff's Assigned Orders
```sql
SELECT fo.*, 
  fm.name as dish_name, r.title as room_title, r.room_number,
  u.full_name as customer_name
FROM food_orders fo
JOIN food_menu fm ON fo.dish_id = fm.id
JOIN rooms r ON fo.room_id = r.id
JOIN users u ON fo.customer_id = u.id
WHERE fo.staff_id = 3
ORDER BY fo.created_at DESC;
```
**Explanation**: This query gets all food orders assigned to a specific staff member, including customer and room information.

#### UPDATE Query - Update Order Status
```sql
UPDATE food_orders 
SET status = 'delivered' 
WHERE id = 1;
```
**Explanation**: This query updates the status of a food order (e.g., from 'preparing' to 'delivered').

---

## 4. DBMS Viva Questions and Answers

### 4.1 Normalization Questions

**Q1. What is Database Normalization?**
**A**: Normalization is the process of organizing data in a database to eliminate redundancy and dependency. It divides larger tables into smaller, related tables and establishes relationships between them. The main goals are to reduce data duplication and ensure data integrity.

**Q2. What are the different Normal Forms?**
**A**: There are several normal forms:
- **1NF (First Normal Form)**: Each column contains atomic values, no repeating groups
- **2NF (Second Normal Form)**: Must be in 1NF, and all non-key attributes fully depend on the primary key
- **3NF (Third Normal Form)**: Must be in 2NF, and no transitive dependencies (non-key attributes don't depend on other non-key attributes)
- **BCNF (Boyce-Codd Normal Form)**: Stricter version of 3NF
- **4NF and 5NF**: Deal with multi-valued dependencies

**Q3. Is your database normalized? Explain.**
**A**: Yes, our database follows 3NF. For example:
- We separate `users`, `rooms`, and `bookings` into different tables instead of storing all data in one table
- The `bookings` table only stores foreign keys (`user_id`, `room_id`) instead of duplicating user and room information
- This eliminates redundancy and maintains data integrity

**Q4. What is redundancy in database?**
**A**: Redundancy means storing the same data multiple times in different places. For example, if we stored customer name and room details in every booking record, that would be redundant. We avoid this by using foreign keys to reference other tables.

**Q5. What is data dependency?**
**A**: Data dependency means one attribute's value depends on another attribute's value. For example, in a booking, `total_amount` depends on `from_date`, `to_date`, and `price_per_night`. We handle this by calculating it or storing it with proper relationships.

---

### 4.2 ER Diagram Questions

**Q6. What is an ER Diagram?**
**A**: An ER (Entity-Relationship) Diagram is a visual representation of the database structure showing entities (tables), attributes (columns), and relationships (connections between tables). It helps understand the database design before implementation.

**Q7. What are entities in your database?**
**A**: Entities are the main objects or tables in our database:
- **User** (customers, staff, admins)
- **Room** (hotel rooms)
- **Booking** (reservations)
- **Food Menu** (food items)
- **Food Order** (customer orders)
- **Room-Staff Assignment** (staff-room relationships)
- **Review** (customer feedback)

**Q8. What are attributes?**
**A**: Attributes are the properties or columns of an entity. For example:
- **User entity** has attributes: id, full_name, email, password, phone, role
- **Room entity** has attributes: id, room_number, title, room_type, capacity, price_per_night, status

**Q9. What is a relationship?**
**A**: A relationship shows how entities are connected. In our database:
- A **User** can make many **Bookings** (One-to-Many)
- A **Room** can have many **Bookings** (One-to-Many)
- A **User** can place many **Food Orders** (One-to-Many)
- A **Room** can have many **Food Orders** (One-to-Many)

**Q10. What are the types of relationships?**
**A**: There are three main types:
- **One-to-One (1:1)**: One record in Table A relates to one record in Table B
- **One-to-Many (1:M)**: One record in Table A relates to many records in Table B
- **Many-to-Many (M:M)**: Many records in Table A relate to many records in Table B (requires a junction table)

---

### 4.3 Relationship Questions

**Q11. What is the relationship between Users and Bookings?**
**A**: **One-to-Many (1:M)** relationship. One user can make multiple bookings, but each booking belongs to only one user. This is implemented using `user_id` as a foreign key in the `bookings` table.

**Q12. What is the relationship between Rooms and Bookings?**
**A**: **One-to-Many (1:M)** relationship. One room can have multiple bookings (at different times), but each booking is for only one room. Implemented using `room_id` as a foreign key in the `bookings` table.

**Q13. What is the relationship between Rooms and Staff?**
**A**: **Many-to-Many (M:M)** relationship. One room can be assigned to multiple staff members over time, and one staff member can be assigned to multiple rooms. This is implemented using the `room_staff_assignments` junction table.

**Q14. What is a junction table?**
**A**: A junction table (also called a bridge table or linking table) is used to implement Many-to-Many relationships. In our database, `room_staff_assignments` is a junction table that connects `rooms` and `users` (staff), storing the assignment relationship with additional attributes like `assigned_at` and `assigned_by`.

**Q15. What is the relationship between Users and Food Orders?**
**A**: **One-to-Many (1:M)** relationship. One customer can place multiple food orders, but each order belongs to only one customer. Implemented using `customer_id` as a foreign key in the `food_orders` table.

---

### 4.4 Key Questions

**Q16. What is a Primary Key?**
**A**: A Primary Key is a unique identifier for each row in a table. It cannot be NULL and must be unique. In our database:
- `users.id` is the primary key for the users table
- `rooms.id` is the primary key for the rooms table
- `bookings.id` is the primary key for the bookings table

**Q17. What is a Foreign Key?**
**A**: A Foreign Key is a column that references the primary key of another table. It establishes a relationship between tables. Examples:
- `bookings.user_id` references `users.id`
- `bookings.room_id` references `rooms.id`
- `food_orders.customer_id` references `users.id`

**Q18. What is a Composite Key?**
**A**: A Composite Key is a primary key made up of multiple columns. In our database, we don't use composite primary keys, but we have a unique constraint on `(room_id, staff_id)` in the `room_staff_assignments` table to ensure one staff per room.

**Q19. What is the difference between Primary Key and Unique Key?**
**A**: 
- **Primary Key**: Only one per table, cannot be NULL, automatically creates an index
- **Unique Key**: Can have multiple per table, can have one NULL value, also creates an index
- Example: `users.email` is a unique key (multiple users can't have the same email), but `users.id` is the primary key

**Q20. What is AUTO_INCREMENT?**
**A**: AUTO_INCREMENT automatically generates a unique number for each new row, typically used for primary keys. For example, when we insert a new user, the `id` column automatically gets the next available number (1, 2, 3, etc.).

---

### 4.5 Join Questions

**Q21. What is a JOIN in SQL?**
**A**: JOIN combines rows from two or more tables based on a related column between them. It allows us to retrieve data from multiple tables in a single query.

**Q22. What is an INNER JOIN?**
**A**: INNER JOIN returns only rows that have matching values in both tables. Example:
```sql
SELECT b.*, r.title 
FROM bookings b
INNER JOIN rooms r ON b.room_id = r.id;
```
This returns only bookings that have a matching room.

**Q23. What is a LEFT JOIN?**
**A**: LEFT JOIN returns all rows from the left table and matching rows from the right table. If no match, NULL values are returned. Example:
```sql
SELECT fo.*, staff.full_name 
FROM food_orders fo
LEFT JOIN users staff ON fo.staff_id = staff.id;
```
This returns all food orders, even if no staff is assigned (staff_name will be NULL).

**Q24. When would you use LEFT JOIN vs INNER JOIN?**
**A**: 
- Use **INNER JOIN** when you only want records that have matches in both tables
- Use **LEFT JOIN** when you want all records from the left table, even if there's no match in the right table
- Example: We use LEFT JOIN for staff in food orders because some orders might not have staff assigned yet

**Q25. What is a subquery?**
**A**: A subquery is a query nested inside another query. Example from our project:
```sql
SELECT r.*, 
  (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as images
FROM rooms r;
```
This subquery gets all images for each room and aggregates them into a JSON array.

---

### 4.6 ACID Properties Questions

**Q26. What are ACID properties?**
**A**: ACID stands for:
- **Atomicity**: All operations in a transaction succeed or all fail (all-or-nothing)
- **Consistency**: Database remains in a valid state after transaction
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Once a transaction is committed, changes are permanent

**Q27. What is Atomicity?**
**A**: Atomicity ensures that a transaction is treated as a single unit. Either all operations complete successfully, or if any operation fails, the entire transaction is rolled back. Example: When creating a booking, if inserting the booking record fails, the entire operation is cancelled.

**Q28. What is Consistency?**
**A**: Consistency ensures the database remains in a valid state. For example, we can't have a booking for a room that doesn't exist, or a booking with more guests than room capacity. Foreign key constraints help maintain consistency.

**Q29. What is Isolation?**
**A**: Isolation ensures that concurrent transactions don't interfere with each other. For example, if two customers try to book the same room simultaneously, only one should succeed. This is handled by database locking mechanisms.

**Q30. What is Durability?**
**A**: Durability ensures that once a transaction is committed, the changes are permanent and will survive system failures. The database writes changes to disk, so even if the server crashes, the data is not lost.

---

### 4.7 Transaction Questions

**Q31. What is a Transaction?**
**A**: A transaction is a sequence of database operations that are treated as a single unit. All operations must complete successfully, or none of them are applied. Example: When a customer books a room, we might need to:
1. Insert booking record
2. Update room status
3. Create payment record
All these must succeed together or all fail together.

**Q32. What is COMMIT?**
**A**: COMMIT saves all changes made during a transaction permanently to the database. Once committed, changes cannot be rolled back.

**Q33. What is ROLLBACK?**
**A**: ROLLBACK undoes all changes made during the current transaction, returning the database to its state before the transaction began.

**Q34. Give an example of a transaction in your project.**
**A**: When placing a food order:
```sql
START TRANSACTION;
  -- Check if room exists
  -- Check if dish exists
  -- Check if customer has active booking
  -- Insert food order
  -- Update room status if needed
COMMIT;
```
If any step fails, we ROLLBACK to maintain data integrity.

---

### 4.8 Index and Performance Questions

**Q35. What is an Index?**
**A**: An index is a data structure that improves the speed of data retrieval operations. It's like an index in a book - instead of scanning every page, you can quickly find what you need. In our database, we have indexes on:
- `rooms.status` - for quick searches of available rooms
- `bookings.user_id` - for fast retrieval of user's bookings
- `bookings.room_id` - for quick room booking lookups

**Q36. What are the advantages and disadvantages of indexes?**
**A**: 
- **Advantages**: Faster SELECT queries, faster JOINs, can enforce uniqueness
- **Disadvantages**: Slower INSERT/UPDATE/DELETE (indexes must be updated), uses extra storage space

**Q37. What is a UNIQUE constraint?**
**A**: A UNIQUE constraint ensures that all values in a column are different. For example, `users.email` has a UNIQUE constraint, so no two users can have the same email address.

---

## 5. ER Diagram Text Explanation

### Entity Relationships in Hotel Booking System

The database follows a well-structured relational model with clear relationships:

#### 1. Users and Bookings (One-to-Many)
- **Relationship**: One user can make multiple bookings
- **Implementation**: `bookings.user_id` → `users.id`
- **Example**: Customer "John" can book Room 101 in January and Room 205 in February

#### 2. Rooms and Bookings (One-to-Many)
- **Relationship**: One room can have multiple bookings at different times
- **Implementation**: `bookings.room_id` → `rooms.id`
- **Example**: Room 101 can be booked by different customers on different dates

#### 3. Rooms and Room Images (One-to-Many)
- **Relationship**: One room can have multiple images
- **Implementation**: `room_images.room_id` → `rooms.id`
- **Example**: Room 101 can have 5 different photos showing different angles

#### 4. Rooms and Staff (Many-to-Many)
- **Relationship**: One room can be assigned to multiple staff members over time, and one staff can handle multiple rooms
- **Implementation**: Junction table `room_staff_assignments` with `room_id` → `rooms.id` and `staff_id` → `users.id`
- **Example**: Room 101 can be assigned to Staff A in the morning and Staff B in the evening

#### 5. Users and Food Orders (One-to-Many)
- **Relationship**: One customer can place multiple food orders
- **Implementation**: `food_orders.customer_id` → `users.id`
- **Example**: Customer "John" can order breakfast, lunch, and dinner on the same day

#### 6. Rooms and Food Orders (One-to-Many)
- **Relationship**: One room can receive multiple food orders
- **Implementation**: `food_orders.room_id` → `rooms.id`
- **Example**: Room 101 can receive multiple food orders throughout the day

#### 7. Food Menu and Food Orders (One-to-Many)
- **Relationship**: One menu item can be ordered multiple times
- **Implementation**: `food_orders.dish_id` → `food_menu.id`
- **Example**: "Butter Chicken" can be ordered by 10 different customers

#### 8. Users and Food Orders (Staff Assignment - One-to-Many)
- **Relationship**: One staff member can handle multiple food orders
- **Implementation**: `food_orders.staff_id` → `users.id`
- **Example**: Staff member "Raju" can handle all food orders for rooms assigned to him

#### 9. Users and Reviews (One-to-Many)
- **Relationship**: One user can write multiple reviews for different rooms
- **Implementation**: `reviews.user_id` → `users.id`
- **Example**: Customer "John" can review Room 101, Room 205, etc.

#### 10. Rooms and Reviews (One-to-Many)
- **Relationship**: One room can receive multiple reviews from different customers
- **Implementation**: `reviews.room_id` → `rooms.id`
- **Example**: Room 101 can have reviews from 50 different customers

### Key Design Principles:
1. **Referential Integrity**: All foreign keys ensure data consistency
2. **Cascade Deletes**: When a room is deleted, related bookings and images are automatically deleted
3. **Normalization**: Data is stored without redundancy
4. **Indexing**: Frequently queried columns are indexed for performance

---

## 6. Conclusion

The **Hotel Booking Management System** is a comprehensive database-driven application that demonstrates strong understanding of **Database Management System (DBMS)** principles and concepts.

### Key DBMS Concepts Implemented:

1. **Normalization**: The database follows 3NF, eliminating redundancy and ensuring data integrity through proper table design and relationships.

2. **Entity-Relationship Modeling**: Clear ER structure with well-defined entities, attributes, and relationships (1:1, 1:M, M:M).

3. **Referential Integrity**: Foreign key constraints ensure data consistency and prevent orphaned records.

4. **ACID Properties**: Transaction management ensures data consistency, atomicity, isolation, and durability.

5. **Indexing**: Strategic use of indexes on frequently queried columns improves query performance.

6. **Data Types and Constraints**: Appropriate use of data types (INT, VARCHAR, DECIMAL, ENUM, TIMESTAMP), primary keys, foreign keys, unique constraints, and check constraints.

7. **SQL Operations**: Comprehensive use of INSERT, SELECT, UPDATE, DELETE operations with JOINs, subqueries, and aggregations.

8. **Scalability**: Database design supports future expansion with modular table structure.

### Project Highlights:

- **9 Main Tables** with proper relationships
- **Role-based Access Control** through user roles
- **Staff Assignment Module** demonstrating Many-to-Many relationships
- **Food Ordering System** with automatic staff assignment
- **Comprehensive Query Operations** for all CRUD operations
- **Data Integrity** through foreign keys and constraints

This project successfully demonstrates practical application of DBMS concepts in a real-world scenario, making it suitable for academic evaluation and understanding of database design principles.

---

**End of Document**

