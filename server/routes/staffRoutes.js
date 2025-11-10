import express from 'express';
import {
  getAssignedRooms,
  updateRoomStatus,
  getAssignedRoomBookings,
  getAssignedFoodOrders
} from '../controllers/staffController.js';
import { protect } from '../middleware/auth.js';
import { staff } from '../middleware/auth.js';

const router = express.Router();

// Staff routes - require staff role
router.get('/rooms', protect, staff, getAssignedRooms);
router.put('/rooms/:id/status', protect, staff, updateRoomStatus);
router.get('/bookings', protect, staff, getAssignedRoomBookings);
router.get('/food-orders', protect, staff, getAssignedFoodOrders);

export default router;

