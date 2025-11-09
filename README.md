# Hotel Booking Management System

A full-stack hotel booking management system built with React, Node.js, Express, and MySQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access (Customer & Admin)
- **Room Management**: Browse, filter, and view room details with image galleries
- **Booking System**: Complete booking flow with date validation and price calculation
- **Admin Dashboard**: Manage rooms, bookings, and view analytics
- **PDF Receipts**: Download booking receipts as PDF
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first, fully responsive UI

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios
- Zustand (State Management)
- React DatePicker
- PDFKit (for receipts)

### Backend
- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)
- express-validator (Input Validation)
- PDFKit (PDF Generation)

## Project Structure

```
hotel-booking-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & validation middleware
│   ├── routes/            # API routes
│   ├── server.js          # Express server
│   └── package.json
├── database/              # Database files
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Database Setup

1. Create MySQL database:
```sql
mysql -u root -p < database/schema.sql
```

2. Seed sample data:
```sql
mysql -u root -p < database/seed.sql
```

**Note**: The seed file contains placeholder bcrypt hashes. For production, generate proper hashes:
- Admin: email: `admin@hotel.com`, password: `admin123`
- Customer: email: `john@example.com`, password: `customer123`

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_booking
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Rooms
- `GET /api/rooms` - Get all rooms (with filters)
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/:id` - Update room (Admin only)
- `DELETE /api/rooms/:id` - Delete room (Admin only)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get bookings (User's own or all if admin)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `PUT /api/bookings/:id` - Update booking status (Admin only)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)
- `GET /api/bookings/:id/receipt` - Download booking receipt PDF (Protected)

### Analytics
- `GET /api/analytics` - Get analytics data (Admin only)

## Default Users

After seeding the database:

**Admin:**
- Email: `admin@hotel.com`
- Password: `admin123`

**Customer:**
- Email: `john@example.com`
- Password: `customer123`

## Features in Detail

### Booking Flow
1. Browse available rooms
2. Filter by price, capacity, and status
3. View room details with image gallery
4. Select check-in/check-out dates
5. Enter number of guests
6. Confirm booking
7. Download PDF receipt

### Admin Dashboard
- View analytics (total bookings, revenue, occupancy rate)
- Manage rooms (add, edit, delete)
- Manage bookings (update status)
- View recent bookings

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation
- Role-based access control
- SQL injection protection (parameterized queries)

## Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

The build output will be in `client/dist/`

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

