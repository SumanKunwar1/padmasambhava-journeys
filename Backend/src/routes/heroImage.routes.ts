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

// Public routes - for frontend display
router.get('/active', getActiveHeroImages);

// Protected routes - require admin authentication
router.use(protect);

// Stats route (must come before /:id to avoid conflicts)
router.get('/admin/stats', getHeroImageStats);

// Reorder route
router.patch('/reorder', reorderHeroImages);

// CRUD operations
router.route('/')
  .get(getAllHeroImages)
  .post(createHeroImage);

router.route('/:id')
  .get(getHeroImage)
  .patch(updateHeroImage)
  .delete(deleteHeroImage);

// Toggle active status
router.patch('/:id/toggle-active', toggleHeroImageActive);

export default router;