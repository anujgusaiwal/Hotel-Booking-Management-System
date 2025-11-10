import express from 'express';
import {
  getFoodMenu,
  getFoodMenuItemById,
  createFoodMenuItem,
  updateFoodMenuItem,
  deleteFoodMenuItem
} from '../controllers/foodMenuController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can view menu
router.get('/', getFoodMenu);
router.get('/:id', getFoodMenuItemById);

// Admin only routes
router.post('/', protect, admin, createFoodMenuItem);
router.put('/:id', protect, admin, updateFoodMenuItem);
router.delete('/:id', protect, admin, deleteFoodMenuItem);

export default router;

