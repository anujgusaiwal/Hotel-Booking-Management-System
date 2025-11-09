# Setup Instructions for Hotel Booking System

## Issues Fixed and How to Use

### 1. Background Image
**Status**: Fixed with fallback gradient
- The background image code is in place
- If you want to use your own image:
  1. Place your hotel image in `client/public/hotel-bg.jpg`
  2. The image will automatically be used
  3. If no image is found, a beautiful gradient background is shown

### 2. Integer Input Fields
**Status**: Fixed
- Number input fields (like "Number of Guests", "Capacity") now only accept integers
- Letters and special characters are blocked
- Test it in the Booking page when selecting number of guests

### 3. Admin Section
**Status**: Implemented
- To access admin section:
  1. Login with admin credentials:
     - Email: `admin@hotel.com`
     - Password: `admin123`
  2. After login, you'll see "Admin" link in the navbar
  3. Click "Admin" to access the dashboard

### 4. Room Types/Categories
**Status**: Implemented
- Admin can select room types when creating/editing rooms:
  - Standard, Deluxe, Suite, Executive, Family, Economy, Penthouse, Presidential
- Users can filter rooms by type on the Rooms page

### 5. 500 Error on Registration
**Possible Causes:**
1. **Database not running** - Make sure MySQL is running
2. **Missing .env file** - Check if `server/.env` exists with:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=hotel_booking
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```
3. **Database not created** - Run `database/schema.sql` to create the database
4. **Tables not created** - Make sure you've run the schema.sql file

**To Fix:**
1. Check if MySQL is running
2. Verify your `.env` file in the `server` folder
3. Make sure the database exists and tables are created
4. Check server console for detailed error messages

## Quick Start Guide

### 1. Database Setup
```bash
# Create database
mysql -u root -p < database/schema.sql

# Add sample data (optional)
mysql -u root -p < database/seed.sql

# If you have existing database, run migration for room types
mysql -u root -p < database/migration_add_room_type.sql
```

### 2. Server Setup
```bash
cd server
npm install
# Create .env file with your database credentials
npm run dev
```

### 3. Client Setup
```bash
cd client
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173 (or the port shown)
- Backend: http://localhost:5000

### 5. Login as Admin
- Email: `admin@hotel.com`
- Password: `admin123`

## Features Available

### For Customers:
- Browse rooms with filters (price, capacity, room type, status)
- View room details
- Book rooms (requires login)
- View bookings
- Profile management

### For Admin:
- **Analytics**: View booking statistics and revenue
- **Rooms**: Add, edit, delete rooms with room types
- **Bookings**: Manage all bookings and update status
- **Users**: Manage all users (add, edit, delete, change roles)

## Troubleshooting

### Background Image Not Showing
- Check if `client/public/hotel-bg.jpg` exists
- If not, the gradient fallback will be used
- Make sure the image file is named exactly `hotel-bg.jpg`

### Integer Input Not Working
- Clear browser cache
- Make sure you're using the updated Input component
- Try refreshing the page

### Admin Link Not Showing
- Make sure you're logged in
- Check if your user role is 'admin' in the database
- Try logging out and logging back in

### 500 Error
- Check server console for detailed error
- Verify database connection in `.env` file
- Make sure MySQL is running
- Check if JWT_SECRET is set in `.env`

