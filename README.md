# Hotel Booking Management System

A comprehensive web-based Hotel Booking Management System built with **MySQL**, **Node.js**, **Express**, and **React**. This system provides a complete solution for managing hotel operations including room bookings, food ordering, staff management, and payment processing.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Hotel Booking Management System is a full-stack web application designed to streamline hotel operations. It enables customers to browse rooms, make bookings, order food, and manage their reservations. Administrators can manage rooms, bookings, staff, and view analytics. Staff members can handle food orders and room assignments.

### Key Objectives

- Provide an intuitive interface for customers to book hotel rooms
- Enable efficient management of room inventory and bookings
- Facilitate food ordering and delivery services
- Support multiple user roles (Customer, Admin, Staff)
- Implement secure payment processing
- Generate analytics and reports for business insights

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database management system
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Payment Gateway** - Payment processing (Future Enhancement)

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Zustand** - State management
- **Vite** - Build tool

### Database
- **MySQL 8.0+** - Database server

## ✨ Features

### Customer Features
- User registration and authentication
- Browse available rooms with filters
- View detailed room information and images
- Make room bookings with date selection
- View booking history and status
- Order food from hotel menu
- Track food orders
- View and update profile
- Payment processing for bookings and orders

### Admin Features
- Dashboard with analytics and statistics
- Manage room inventory (add, edit, delete rooms)
- View all bookings and manage booking status
- Manage food menu items
- View all food orders
- Manage staff members
- Assign staff to rooms and orders
- View revenue and booking reports
- Export reports to PDF

### Staff Features
- View assigned rooms
- Manage food order status
- Update room status (cleaning, maintenance)
- View assigned tasks

## 📁 Project Structure

```
hotel-booking-system/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling files
│   └── package.json
├── server/                 # Node.js backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── database/              # Database scripts
│   ├── schema.sql         # Main database schema
│   ├── seed.sql           # Sample data
│   └── migration_*.sql    # Database migrations
└── docs/                  # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/hotel-booking-system.git
cd hotel-booking-system
```

### Step 2: Install Dependencies

#### Backend Dependencies

```bash
cd server
npm install
```

#### Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_booking
JWT_SECRET=your_jwt_secret_key
PORT=5000
# Payment gateway configuration (Future Enhancement)
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🗄 Database Setup

### Step 1: Create Database

1. Open MySQL command line or MySQL Workbench
2. Run the main schema file:

```bash
mysql -u root -p < database/schema.sql
```

### Step 2: Run Migrations

Execute migration files in order:

```bash
mysql -u root -p hotel_booking < database/migration_add_room_number.sql
mysql -u root -p hotel_booking < database/migration_add_room_type.sql
mysql -u root -p hotel_booking < database/migration_add_pending_booking_status.sql
mysql -u root -p hotel_booking < database/migration_add_food_ordering.sql
mysql -u root -p hotel_booking < database/migration_add_staff.sql
mysql -u root -p hotel_booking < database/migration_add_staff_to_orders.sql
mysql -u root -p hotel_booking < database/migration_add_payment.sql
```

### Step 3: Seed Sample Data

```bash
mysql -u root -p hotel_booking < database/seed.sql
```

### Step 4: Create Admin User

```bash
mysql -u root -p hotel_booking < database/create_admin.sql
```

## ▶ Running the Application

### Start Backend Server

```bash
cd server
npm start
# or for development
npm run dev
```

The server will run on `http://localhost:5000`

### Start Frontend Application

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Default Credentials

- **Admin**: 
  - Email: `admin@hotel.com`
  - Password: `admin123`

- **Customer**: 
  - Email: `john@example.com`
  - Password: `customer123`

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Problem Statement](docs/problem_statement.md) - Project requirements and objectives
- [Features](docs/features.md) - Detailed feature list
- [ER Diagram](docs/er_diagram.md) - Entity-Relationship diagram
- [Database Schema](docs/database_schema.md) - Complete database structure
- [SQL Queries](docs/queries.md) - Sample queries and operations
- [Screenshots](docs/screenshots.md) - Application screenshots
- [Future Scope](docs/future_scope.md) - Future enhancements

## 🔐 Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- SQL injection prevention using parameterized queries
- CORS configuration
- Input validation and sanitization

## 📊 Database Features

- Normalized database design (3NF)
- Foreign key constraints
- Indexes for optimized queries
- Transaction support
- Stored procedures for complex operations
- Triggers for data integrity

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - *Anuj Gusaiwal*

## 🙏 Acknowledgments

- MySQL documentation
- React and Express.js communities
- Tailwind CSS for the utility-first CSS framework

---

**Note**: This is a DBMS project for academic purposes. For production use, additional security measures and optimizations are recommended.

