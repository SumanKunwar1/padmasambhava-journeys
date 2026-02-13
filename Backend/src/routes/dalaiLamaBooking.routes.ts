// routes/dalaiLamaBooking.routes.ts - CRITICAL FIX ONLY
import express from 'express';
import {
  createDalaiLamaBooking,
  getAllDalaiLamaBookings,
  getDalaiLamaBooking,
  updateDalaiLamaBooking,
  deleteDalaiLamaBooking,
  getDalaiLamaBookingStats,
} from '../controllers/dalaiLamaBooking.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public route - no auth required
router.post('/', createDalaiLamaBooking);

// Apply auth middleware to all routes below
router.use(protect);

// ⭐ CRITICAL FIX: Static routes MUST come BEFORE dynamic routes
// /admin/stats must be before /:id to prevent /:id matching /admin/stats with id="admin"
router.get('/admin/stats', getDalaiLamaBookingStats);

// Dynamic routes after static routes
router.get('/', getAllDalaiLamaBookings);
router.get('/:id', getDalaiLamaBooking);
router.patch('/:id', updateDalaiLamaBooking);
router.delete('/:id', deleteDalaiLamaBooking);

export default router;