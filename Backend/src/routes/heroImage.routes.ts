// routes/heroImage.routes.ts
import express from 'express';
import {
  createHeroImage,
  getAllHeroImages,
  getActiveHeroImages,
  getHeroImage,
  updateHeroImage,
  toggleHeroImageActive,
  deleteHeroImage,
  reorderHeroImages,
  getHeroImageStats,
} from '../controllers/heroImage.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes - for frontend display (must come FIRST before protect middleware)
router.get('/active', getActiveHeroImages);

// Admin stats route (protected) - must come before /:id to avoid route conflicts
router.get('/admin/stats', protect, getHeroImageStats);

// Reorder route (protected)
router.patch('/reorder', protect, reorderHeroImages);

// Toggle active status (protected)
router.patch('/:id/toggle-active', protect, toggleHeroImageActive);

// CRUD operations
router.route('/')
  .get(protect, getAllHeroImages)      // Protected - admin only
  .post(protect, createHeroImage);     // Protected - admin only

router.route('/:id')
  .get(protect, getHeroImage)          // Protected - admin only
  .patch(protect, updateHeroImage)     // Protected - admin only
  .delete(protect, deleteHeroImage);   // Protected - admin only

export default router;