// routes/agentTrip.routes.ts
import express from 'express';
import {
  createAgentTrip,
  getAllAgentTrips,
  getAgentTrip,
  updateAgentTrip,
  deleteAgentTrip,
  getAgentTripStats,
  toggleTripActive,
  bulkCreateAgentTrips,
} from '../controllers/agentTrip.controller';
import { protect } from '../controllers/auth.controller';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

// Public routes - Agents can view trips
router.get('/', getAllAgentTrips);
router.get('/:id', getAgentTrip);

// Protected routes - Admin only
router.use(protect);

// ⭐ CRITICAL: Static routes BEFORE dynamic routes
router.get('/admin/stats', getAgentTripStats);
router.post('/bulk', bulkCreateAgentTrips);

// CRUD operations with image upload support
router.post('/', uploadSingle('image'), createAgentTrip);
router.patch('/:id', uploadSingle('image'), updateAgentTrip);
router.delete('/:id', deleteAgentTrip);

// Toggle active status
router.patch('/:id/toggle-active', toggleTripActive);

export default router;