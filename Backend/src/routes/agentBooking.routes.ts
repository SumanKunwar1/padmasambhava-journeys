// routes/agentBooking.routes.ts
import express from 'express';
import {
  createAgentBooking,
  getAllAgentBookings,
  getAgentBooking,
  updateAgentBooking,
  deleteAgentBooking,
  getAgentBookingStats,
} from '../controllers/agentBooking.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// ⭐ PUBLIC: Agents submit bookings (no admin auth needed)
router.post('/', createAgentBooking);

// Protected admin routes below
router.use(protect);

// ⭐ CRITICAL: Static routes BEFORE dynamic /:id routes
router.get('/stats', getAgentBookingStats);
router.get('/', getAllAgentBookings);

// Dynamic routes last
router.get('/:id', getAgentBooking);
router.patch('/:id', updateAgentBooking);
router.delete('/:id', deleteAgentBooking);

export default router;