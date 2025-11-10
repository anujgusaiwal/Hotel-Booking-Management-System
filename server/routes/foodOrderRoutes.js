import express from 'express';
import {
  placeFoodOrder,
  getCustomerOrders,
  getAllFoodOrders,
  updateFoodOrderStatus,
  getCustomerActiveBookings
} from '../controllers/foodOrderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.get('/my-orders', protect, getCustomerOrders);
router.get('/active-bookings', protect, getCustomerActiveBookings);
router.post('/', protect, placeFoodOrder);

// Admin routes
router.get('/all', protect, admin, getAllFoodOrders);
router.put('/:id/status', protect, admin, updateFoodOrderStatus);

export default router;

