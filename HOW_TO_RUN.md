# How to Run the Hotel Booking System

## Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### Step 1: Database Setup

1. **Start MySQL Server**
   - Make sure MySQL is running on your system
   - Open MySQL Command Line Client or MySQL Workbench

2. **Create the Database**
   ```bash
   # Option 1: Using MySQL Command Line
   mysql -u root -p < database/schema.sql
   
   # Option 2: Using MySQL Workbench
   # Open database/schema.sql and run it
   ```

3. **Add Sample Data (Optional)**
   ```bash
   mysql -u root -p < database/seed.sql
   ```

4. **Add Room Types (If using existing database)**
   ```bash
   mysql -u root -p < database/migration_add_room_type.sql
   ```

### Step 2: Backend Server Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   - Create a file named `.env` in the `server` folder
   - Add the following content (update with your MySQL credentials):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hotel_booking
   JWT_SECRET=your_secret_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   ```

   **Important**: Replace `your_mysql_password` with your actual MySQL password and `your_secret_key_here_make_it_long_and_random` with a random secret string.

4. **Start the server**
   ```bash
   npm run dev
   ```
   
   You should see: `Server running on port 5000`

### Step 3: Frontend Client Setup

1. **Open a NEW terminal window** (keep the server running)

2. **Navigate to client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   You should see something like: `Local: http://localhost:5173`

### Step 4: Access the Application

1. **Open your browser** and go to: `http://localhost:5173` (or the port shown in terminal)

2. **Login as Admin** (to access admin features):
   - Email: `admin@hotel.com`
   - Password: `admin123`

3. **Or Register** a new customer account

## Quick Start Commands

### Windows (PowerShell)

**Terminal 1 - Backend:**
```powershell
cd server
npm install
# Create .env file with your database credentials
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm install
npm run dev
```

### Mac/Linux

**Terminal 1 - Backend:**
```bash
cd server
npm install
# Create .env file with your database credentials
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

## Troubleshooting

### Database Connection Error
- Check if MySQL is running
- Verify your `.env` file has correct credentials
- Make sure the database `hotel_booking` exists

### Port Already in Use
- Backend: Change `PORT=5000` to another port in `.env`
- Frontend: Vite will automatically use the next available port

### Module Not Found
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### 500 Error on Registration
- Check server console for detailed error
- Verify database connection
- Make sure JWT_SECRET is set in `.env`
- Check if database tables exist

## Default Login Credentials

**Admin:**
- Email: `admin@hotel.com`
- Password: `admin123`

**Customer:**
- Email: `john@example.com`
- Password: `customer123`

## Features to Test

1. **Home Page**: Should show background image/gradient
2. **Rooms Page**: Browse and filter rooms by type, price, capacity
3. **Booking**: Select dates and number of guests (integer input only)
4. **Admin Dashboard**: Login as admin to see:
   - Analytics
   - Room Management (with room types)
   - Booking Management
   - User Management

## Production Build

To build for production:

**Frontend:**
```bash
cd client
npm run build
```

The built files will be in `client/dist/`

**Backend:**
```bash
cd server
npm start
```

## Need Help?

- Check server console for errors
- Check browser console (F12) for frontend errors
- Verify all environment variables in `.env`
- Make sure MySQL is running and accessible

