import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adminStaffRoutes from './routes/adminStaffRoutes.js';
import foodMenuRoutes from './routes/foodMenuRoutes.js';
import foodOrderRoutes from './routes/foodOrderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminStaffRoutes);
app.use('/api/food-menu', foodMenuRoutes);
app.use('/api/food-orders', foodOrderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Database connection test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = (await import('./config/database.js')).default;
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ 
      message: 'Database connection successful',
      test: rows[0],
      env: {
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      code: error.code
    });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientPath));
  
  // The "catchall" handler: for any request that doesn't
  // match an API route, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Serving frontend from: ${path.join(__dirname, '../client/dist')}`);
  }
});

