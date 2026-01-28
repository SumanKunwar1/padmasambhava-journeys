// routes/trip.routes.ts
import express from 'express';
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripsByCategory,
  getTripsByType,
  getFeaturedTrips,
  getTripStats,
} from '../controllers/trip.controller';
import { protect } from '../controllers/auth.controller';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedTrips);
router.get('/category/:category', getTripsByCategory);
router.get('/type/:type', getTripsByType);
router.get('/', getAllTrips);
router.get('/:id', getTripById);

// Protected admin routes
router.use(protect); // All routes after this require authentication

router.get('/admin/stats', getTripStats);
router.post('/', uploadSingle, createTrip);
router.patch('/:id', uploadSingle, updateTrip);
router.delete('/:id', deleteTrip);

export default router;