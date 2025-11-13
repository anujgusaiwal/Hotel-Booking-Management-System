# Entity-Relationship Diagram

## Hotel Booking Management System - ER Diagram

This document describes the Entity-Relationship (ER) model for the Hotel Booking Management System database.

---

## 📊 ER Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HOTEL BOOKING MANAGEMENT SYSTEM                      │
│                         ER DIAGRAM                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    USERS     │
├──────────────┤
│ PK id        │
│    full_name │
│    email     │ (UNIQUE)
│    password  │
│    phone     │
│    role      │ (ENUM: customer, admin, staff)
│    created_at│
│    updated_at│
└──────┬───────┘
       │
       │ 1
       │
       │ N
       │
┌──────▼───────┐         ┌──────────────┐
│   BOOKINGS   │         │     ROOMS    │
├──────────────┤         ├──────────────┤
│ PK id        │         │ PK id        │
│ FK user_id   │─────────┤    room_number│ (UNIQUE)
│ FK room_id   │──┐      │    title     │
│    from_date │  │      │    room_type │
│    to_date   │  │      │    description│
│    guests    │  │      │    capacity  │
│    total_amt │  │      │    price_per │
│    reference │  │      │    features  │ (JSON)
│    status    │  │      │    status    │
│    payment_  │  │      │    created_at│
│    status    │  │      │    updated_at│
│    payment_id│  │      └──────┬───────┘
│    payment_  │  │             │
│    gateway_  │  │             │
│    order_id  │  │             │ 1
│    created_at│  │             │
│    updated_at│  │             │ N
└──────────────┘  │      ┌──────▼───────┐
                  │      │ ROOM_IMAGES  │
                  │      ├──────────────┤
                  │      │ PK id        │
                  │      │ FK room_id   │
                  │      │    url       │
                  │      │    created_at│
                  │      └──────────────┘
                  │
                  │ N
                  │
┌─────────────────▼──────┐
│      REVIEWS           │
├────────────────────────┤
│ PK id                  │
│ FK user_id             │
│ FK room_id             │
│    rating              │ (1-5)
│    comment             │
│    created_at          │
│    updated_at          │
└────────────────────────┘

┌──────────────┐
│  FOOD_MENU   │
├──────────────┤
│ PK id        │
│    name      │
│    description│
│    price     │
│    created_at│
│    updated_at│
└──────┬───────┘
       │
       │ 1
       │
       │ N
       │
┌──────▼──────────────┐
│   FOOD_ORDERS       │
├─────────────────────┤
│ PK id               │
│ FK customer_id      │──┐
│ FK room_id          │  │
│ FK staff_id         │──┼──┐
│ FK dish_id          │  │  │
│    quantity         │  │  │
│    total_price      │  │  │
│    status           │  │  │
│    payment_status   │  │  │
│    payment_id       │  │  │
│    payment_gateway_ │  │  │
│    order_id         │  │  │
│    created_at       │  │  │
│    updated_at       │  │  │
└─────────────────────┘  │  │
                         │  │
                         │  │
┌─────────────────────────┴──┴──┐
│  ROOM_STAFF_ASSIGNMENTS       │
├───────────────────────────────┤
│ PK id                         │
│ FK room_id                    │
│ FK staff_id                   │
│    assigned_at                │
│ FK assigned_by                │
└───────────────────────────────┘
```

---

## 📋 Entity Descriptions

### 1. USERS Entity

**Purpose**: Stores information about all system users (customers, admins, staff)

**Attributes**:
- `id` (Primary Key): Unique identifier
- `full_name`: User's full name
- `email` (Unique): Email address (used for login)
- `password`: Hashed password
- `phone`: Contact number
- `role`: User role (customer, admin, staff)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- One-to-Many with BOOKINGS (one user can have many bookings)
- One-to-Many with REVIEWS (one user can write many reviews)
- One-to-Many with FOOD_ORDERS (one customer can place many orders)
- One-to-Many with ROOM_STAFF_ASSIGNMENTS (one staff can have many assignments)

---

### 2. ROOMS Entity

**Purpose**: Stores information about hotel rooms

**Attributes**:
- `id` (Primary Key): Unique identifier
- `room_number` (Unique): Physical room number
- `title`: Room title/name
- `room_type`: Type of room (standard, deluxe, suite, etc.)
- `description`: Detailed room description
- `capacity`: Maximum number of guests
- `price_per_night`: Room rate per night
- `features` (JSON): Room amenities (WiFi, TV, AC, etc.)
- `status`: Current room status (available, unavailable, maintenance, occupied, cleaning)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- One-to-Many with BOOKINGS (one room can have many bookings)
- One-to-Many with ROOM_IMAGES (one room can have many images)
- One-to-Many with REVIEWS (one room can have many reviews)
- One-to-Many with FOOD_ORDERS (orders can be delivered to rooms)
- One-to-Many with ROOM_STAFF_ASSIGNMENTS (one room can be assigned to many staff)

---

### 3. ROOM_IMAGES Entity

**Purpose**: Stores images associated with rooms

**Attributes**:
- `id` (Primary Key): Unique identifier
- `room_id` (Foreign Key): Reference to rooms table
- `url`: Image URL/path
- `created_at`: Upload timestamp

**Relationships**:
- Many-to-One with ROOMS (many images belong to one room)

---

### 4. BOOKINGS Entity

**Purpose**: Stores customer booking information

**Attributes**:
- `id` (Primary Key): Unique identifier
- `user_id` (Foreign Key): Reference to users table
- `room_id` (Foreign Key): Reference to rooms table
- `from_date`: Check-in date
- `to_date`: Check-out date
- `guests`: Number of guests
- `total_amount`: Total booking amount
- `reference` (Unique): Booking reference number
- `status`: Booking status (pending, confirmed, cancelled, completed)
- `payment_status`: Payment status (pending, paid, failed, refunded)
- `payment_id`: Payment transaction ID
- `payment_gateway_order_id`: Payment gateway order identifier (Future Enhancement)
- `created_at`: Booking creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- Many-to-One with USERS (many bookings belong to one user)
- Many-to-One with ROOMS (many bookings for one room)

---

### 5. REVIEWS Entity

**Purpose**: Stores customer reviews and ratings for rooms

**Attributes**:
- `id` (Primary Key): Unique identifier
- `user_id` (Foreign Key): Reference to users table
- `room_id` (Foreign Key): Reference to rooms table
- `rating`: Rating value (1-5)
- `comment`: Review text
- `created_at`: Review creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- Many-to-One with USERS (many reviews from one user)
- Many-to-One with ROOMS (many reviews for one room)

---

### 6. FOOD_MENU Entity

**Purpose**: Stores food menu items

**Attributes**:
- `id` (Primary Key): Unique identifier
- `name`: Dish name
- `description`: Dish description
- `price`: Dish price
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- One-to-Many with FOOD_ORDERS (one dish can be in many orders)

---

### 7. FOOD_ORDERS Entity

**Purpose**: Stores food order information

**Attributes**:
- `id` (Primary Key): Unique identifier
- `customer_id` (Foreign Key): Reference to users table
- `room_id` (Foreign Key): Reference to rooms table
- `staff_id` (Foreign Key, Nullable): Reference to assigned staff
- `dish_id` (Foreign Key): Reference to food_menu table
- `quantity`: Number of items ordered
- `total_price`: Total order amount
- `status`: Order status (pending, preparing, delivered, cancelled)
- `payment_status`: Payment status (pending, paid, failed, refunded)
- `payment_id`: Payment transaction ID
- `payment_gateway_order_id`: Payment gateway order identifier (Future Enhancement)
- `created_at`: Order creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- Many-to-One with USERS (customer) (many orders from one customer)
- Many-to-One with USERS (staff) (many orders assigned to one staff)
- Many-to-One with ROOMS (orders delivered to rooms)
- Many-to-One with FOOD_MENU (orders contain menu items)

---

### 8. ROOM_STAFF_ASSIGNMENTS Entity

**Purpose**: Tracks staff assignments to rooms

**Attributes**:
- `id` (Primary Key): Unique identifier
- `room_id` (Foreign Key): Reference to rooms table
- `staff_id` (Foreign Key): Reference to users table (staff)
- `assigned_at`: Assignment timestamp
- `assigned_by` (Foreign Key, Nullable): Reference to users table (admin who assigned)

**Relationships**:
- Many-to-One with ROOMS (many assignments for one room)
- Many-to-One with USERS (staff) (many assignments for one staff)
- Many-to-One with USERS (admin) (assignments made by admin)

---

## 🔗 Relationship Summary

### One-to-Many Relationships

1. **USERS → BOOKINGS**: One user can make multiple bookings
2. **USERS → REVIEWS**: One user can write multiple reviews
3. **USERS → FOOD_ORDERS**: One customer can place multiple orders
4. **ROOMS → BOOKINGS**: One room can have multiple bookings (over time)
5. **ROOMS → ROOM_IMAGES**: One room can have multiple images
6. **ROOMS → REVIEWS**: One room can receive multiple reviews
7. **ROOMS → FOOD_ORDERS**: Orders can be delivered to different rooms
8. **ROOMS → ROOM_STAFF_ASSIGNMENTS**: One room can be assigned to multiple staff
9. **FOOD_MENU → FOOD_ORDERS**: One dish can be ordered multiple times
10. **USERS (staff) → FOOD_ORDERS**: One staff can handle multiple orders
11. **USERS (staff) → ROOM_STAFF_ASSIGNMENTS**: One staff can have multiple room assignments

### Many-to-One Relationships

All relationships are implemented as Many-to-One using Foreign Keys, which is the standard approach in relational databases.

---

## 🔑 Key Constraints

### Primary Keys (PK)
- All entities have an auto-incrementing `id` as primary key

### Foreign Keys (FK)
- All foreign keys maintain referential integrity
- Cascade delete is used where appropriate
- Set NULL is used for optional relationships

### Unique Constraints
- `users.email`: Email must be unique
- `rooms.room_number`: Room number must be unique
- `bookings.reference`: Booking reference must be unique

### Check Constraints
- `reviews.rating`: Must be between 1 and 5
- `bookings.status`: Must be one of the defined enum values
- `rooms.status`: Must be one of the defined enum values

---

## 📊 Cardinality

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| USERS ↔ BOOKINGS | 1:N | One user can have many bookings |
| ROOMS ↔ BOOKINGS | 1:N | One room can have many bookings |
| ROOMS ↔ ROOM_IMAGES | 1:N | One room can have many images |
| USERS ↔ REVIEWS | 1:N | One user can write many reviews |
| ROOMS ↔ REVIEWS | 1:N | One room can have many reviews |
| FOOD_MENU ↔ FOOD_ORDERS | 1:N | One dish can be in many orders |
| USERS ↔ FOOD_ORDERS | 1:N | One customer can place many orders |
| ROOMS ↔ FOOD_ORDERS | 1:N | Orders can be for different rooms |
| USERS ↔ ROOM_STAFF_ASSIGNMENTS | 1:N | One staff can have many assignments |
| ROOMS ↔ ROOM_STAFF_ASSIGNMENTS | 1:N | One room can be assigned to many staff |

---

## 🎯 Design Principles

1. **Normalization**: Database is normalized to 3NF (Third Normal Form)
2. **Referential Integrity**: All foreign keys maintain data consistency
3. **Data Integrity**: Constraints ensure valid data entry
4. **Scalability**: Design supports future enhancements
5. **Performance**: Indexes on frequently queried columns
6. **Flexibility**: JSON field for room features allows extensibility

---

## 📝 Notes

- The ER diagram represents the logical structure of the database
- All relationships are properly defined with foreign keys
- The design follows database normalization principles
- Indexes are created on foreign keys and frequently queried columns
- Timestamps (`created_at`, `updated_at`) are maintained for audit purposes

