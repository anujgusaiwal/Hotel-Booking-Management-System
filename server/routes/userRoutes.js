import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// All routes require admin authentication
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.post('/', protect, admin, createUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;

