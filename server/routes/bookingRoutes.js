import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingReceipt
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { bookingValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/', protect, validate(bookingValidation), createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);
router.get('/:id/receipt', protect, getBookingReceipt);

export default router;

