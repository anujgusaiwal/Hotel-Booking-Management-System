import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  assignStaffToRoom,
  unassignStaffFromRoom,
  getAllAssignments,
  getAllStaff
} from '../controllers/staffController.js';

const router = express.Router();

// Admin routes for staff management
router.get('/staff', protect, admin, getAllStaff);
router.get('/assignments', protect, admin, getAllAssignments);
router.post('/assign', protect, admin, assignStaffToRoom);
router.post('/unassign', protect, admin, unassignStaffFromRoom);

export default router;

