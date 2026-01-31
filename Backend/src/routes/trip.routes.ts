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

// Public routes - KEEP THESE FIRST
router.get('/featured', getFeaturedTrips);
router.get('/category/:category', getTripsByCategory);
router.get('/type/:type', getTripsByType);

// Protected admin routes - PLACE BEFORE GENERIC ROUTES
router.get('/admin/stats', protect, getTripStats);

// Public get all trips
router.get('/', getAllTrips);

// Protected admin routes for create/update/delete
// FIXED: Now passing 'image' as the field name to uploadSingle
router.post('/', protect, uploadSingle('image'), createTrip);
router.patch('/:id', protect, uploadSingle('image'), updateTrip);
router.delete('/:id', protect, deleteTrip);

// Public get by ID - MUST BE LAST because :id is a catch-all
router.get('/:id', getTripById);

export default router;