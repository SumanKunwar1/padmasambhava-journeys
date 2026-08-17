// routes/exploreDestination.routes.ts
import express from 'express';
import {
  createExploreDestination,
  getAllExploreDestinations,
  getActiveExploreDestinations,
  getExploreDestinationBySlug,
  getExploreDestination,
  updateExploreDestination,
  toggleExploreDestinationActive,
  deleteExploreDestination,
  reorderExploreDestinations,
  getExploreDestinationStats,
} from '../controllers/exploreDestination.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes - for frontend display
router.get('/active', getActiveExploreDestinations);

// Public lookup by slug - must come before /:id to avoid route conflicts
router.get('/slug/:slug', getExploreDestinationBySlug);

// Admin stats route (protected) - must come before /:id to avoid route conflicts
router.get('/admin/stats', protect, getExploreDestinationStats);

// Reorder route (protected)
router.patch('/reorder', protect, reorderExploreDestinations);

// Toggle active status (protected)
router.patch('/:id/toggle-active', protect, toggleExploreDestinationActive);

// CRUD operations
router
  .route('/')
  .get(protect, getAllExploreDestinations) // Protected - admin only
  .post(protect, createExploreDestination); // Protected - admin only

router
  .route('/:id')
  .get(protect, getExploreDestination) // Protected - admin only
  .patch(protect, updateExploreDestination) // Protected - admin only
  .delete(protect, deleteExploreDestination); // Protected - admin only

export default router;