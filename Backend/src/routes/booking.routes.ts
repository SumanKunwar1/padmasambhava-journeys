// routes/booking.routes.ts
import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingStats,
} from '../controllers/booking.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes
router.post('/', createBooking);

// Protected routes - require authentication
router.use(protect);

// ⭐ CRITICAL: Static routes BEFORE dynamic routes
router.get('/admin/stats', getBookingStats);
router.get('/', getAllBookings);

// Dynamic routes last
router.get('/:id', getBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;