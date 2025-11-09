# ER Diagram Content - Hotel Booking Management System

## Slide Title Options:
- "Database Design - ER Diagram"
- "Entity Relationship Diagram"
- "Database Schema Design"
- "Data Model - ER Diagram"

---

## Option 1: Concise Description (Recommended for PPT)

**ER Diagram Overview:**

The database consists of 5 main entities with well-defined relationships:

**Entities:**
1. **Users** - Stores customer and admin information
2. **Rooms** - Contains room details and pricing
3. **Room_Images** - Stores room images (linked to rooms)
4. **Bookings** - Manages reservation data
5. **Reviews** - Stores customer feedback

**Key Relationships:**
- Users → Bookings (One-to-Many)
- Rooms → Bookings (One-to-Many)
- Rooms → Room_Images (One-to-Many)
- Users → Reviews (One-to-Many)
- Rooms → Reviews (One-to-Many)

---

## Option 2: Detailed Entity Description

**ER Diagram - Database Entities:**

**1. Users Entity:**
- Primary Key: id
- Attributes: full_name, email, password, phone, role
- Role: Stores both customers and administrators
- Relationships: Has many bookings and reviews

**2. Rooms Entity:**
- Primary Key: id
- Attributes: title, description, capacity, price_per_night, features (JSON), status
- Relationships: Has many bookings, images, and reviews

**3. Room_Images Entity:**
- Primary Key: id
- Foreign Key: room_id (references Rooms)
- Attributes: url
- Relationship: Belongs to one room

**4. Bookings Entity:**
- Primary Key: id
- Foreign Keys: user_id (references Users), room_id (references Rooms)
- Attributes: from_date, to_date, guests, total_amount, reference, status
- Relationships: Belongs to one user and one room

**5. Reviews Entity:**
- Primary Key: id
- Foreign Keys: user_id (references Users), room_id (references Rooms)
- Attributes: rating, comment
- Relationships: Belongs to one user and one room

---

## Option 3: Relationship Focus

**ER Diagram - Entity Relationships:**

**Primary Relationships:**

1. **Users ↔ Bookings** (One-to-Many)
   - One user can have multiple bookings
   - Each booking belongs to one user

2. **Rooms ↔ Bookings** (One-to-Many)
   - One room can have multiple bookings
   - Each booking is for one room

3. **Rooms ↔ Room_Images** (One-to-Many)
   - One room can have multiple images
   - Each image belongs to one room

4. **Users ↔ Reviews** (One-to-Many)
   - One user can write multiple reviews
   - Each review is written by one user

5. **Rooms ↔ Reviews** (One-to-Many)
   - One room can have multiple reviews
   - Each review is for one room

**Cardinality:**
- Users → Bookings: 1:N
- Rooms → Bookings: 1:N
- Rooms → Room_Images: 1:N
- Users → Reviews: 1:N
- Rooms → Reviews: 1:N

---

## Option 4: Attribute Details

**ER Diagram - Entity Attributes:**

**Users Table:**
- id (PK, INT, Auto Increment)
- full_name (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- phone (VARCHAR, Optional)
- role (ENUM: 'customer', 'admin')
- created_at, updated_at (Timestamps)

**Rooms Table:**
- id (PK, INT, Auto Increment)
- title (VARCHAR)
- description (TEXT)
- capacity (INT)
- price_per_night (DECIMAL)
- features (JSON)
- status (ENUM: 'available', 'unavailable', 'maintenance')
- created_at, updated_at (Timestamps)

**Room_Images Table:**
- id (PK, INT, Auto Increment)
- room_id (FK → Rooms.id)
- url (VARCHAR)
- created_at (Timestamp)

**Bookings Table:**
- id (PK, INT, Auto Increment)
- user_id (FK → Users.id)
- room_id (FK → Rooms.id)
- from_date (DATE)
- to_date (DATE)
- guests (INT)
- total_amount (DECIMAL)
- reference (VARCHAR, Unique)
- status (ENUM: 'confirmed', 'cancelled', 'completed')
- created_at, updated_at (Timestamps)

**Reviews Table:**
- id (PK, INT, Auto Increment)
- user_id (FK → Users.id)
- room_id (FK → Rooms.id)
- rating (INT, 1-5)
- comment (TEXT, Optional)
- created_at, updated_at (Timestamps)

---

## Option 5: Design Principles

**ER Diagram - Design Principles:**

**Normalization:**
- First Normal Form (1NF): All attributes are atomic
- Second Normal Form (2NF): No partial dependencies
- Third Normal Form (3NF): No transitive dependencies

**Key Design Features:**
- **Primary Keys**: Unique identifiers for each entity
- **Foreign Keys**: Maintain referential integrity
- **Indexes**: Optimized for performance on frequently queried fields
- **Constraints**: Data validation and integrity rules
- **Cascade Deletes**: Automatic cleanup of related records

**Data Integrity:**
- Foreign key constraints ensure data consistency
- Unique constraints prevent duplicate entries
- Check constraints validate data ranges (e.g., rating 1-5)
- NOT NULL constraints ensure required fields

---

## Option 6: Bullet Points Format (Best for PPT)

**ER Diagram - Database Schema:**

**5 Main Entities:**

• **Users** - Customer and admin accounts (id, email, password, role)

• **Rooms** - Room information (id, title, capacity, price, features, status)

• **Room_Images** - Room photos (id, room_id, url)

• **Bookings** - Reservation records (id, user_id, room_id, dates, amount, reference)

• **Reviews** - Customer feedback (id, user_id, room_id, rating, comment)

**Key Relationships:**

• Users → Bookings (1:N) - One user, many bookings

• Rooms → Bookings (1:N) - One room, many bookings

• Rooms → Room_Images (1:N) - One room, many images

• Users → Reviews (1:N) - One user, many reviews

• Rooms → Reviews (1:N) - One room, many reviews

**Design Features:**

• Normalized database structure

• Foreign key relationships

• Indexed for performance

• Data integrity constraints

---

## Option 7: Summary Format

**ER Diagram Summary:**

The database design follows a normalized structure with 5 core entities:

1. **Users** - Authentication and user management
2. **Rooms** - Room catalog and inventory
3. **Room_Images** - Media storage for rooms
4. **Bookings** - Reservation management
5. **Reviews** - Customer feedback system

**Relationship Structure:**
- Users and Rooms are central entities
- Bookings connects Users and Rooms
- Room_Images extends Rooms
- Reviews connects Users and Rooms

**Database Features:**
- Optimized indexes for fast queries
- Foreign key constraints for data integrity
- JSON storage for flexible room features
- Timestamps for audit trails

---

## Recommended for Your PPT:

**ER Diagram - Database Design**

**5 Core Entities:**

• **Users** - Stores customer and admin accounts (id, email, password, role)

• **Rooms** - Contains room details (id, title, capacity, price, features, status)

• **Room_Images** - Stores room photos (id, room_id, url)

• **Bookings** - Manages reservations (id, user_id, room_id, dates, amount, reference)

• **Reviews** - Stores customer feedback (id, user_id, room_id, rating, comment)

**Entity Relationships:**

• Users → Bookings (One-to-Many)

• Rooms → Bookings (One-to-Many)

• Rooms → Room_Images (One-to-Many)

• Users → Reviews (One-to-Many)

• Rooms → Reviews (One-to-Many)

**Design Features:**

• Normalized database structure

• Foreign key relationships for data integrity

• Indexed fields for optimal performance

• JSON storage for flexible room features

---

## Visual Suggestions:

- Use arrows to show relationships
- Different colors for each entity
- Primary keys highlighted
- Foreign keys shown with dashed lines
- Cardinality notation (1:N) on relationship lines
- Entity boxes with attribute lists

