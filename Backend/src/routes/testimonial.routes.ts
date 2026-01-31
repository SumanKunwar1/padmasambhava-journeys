// routes/testimonial.routes.ts
import express from 'express';
import {
  createTestimonial,
  getAllTestimonials,
  getPublicTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleActive,
  toggleFeatured,
  getTestimonialStats,
} from '../controllers/testimonial.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes
router.get('/public', getPublicTestimonials);

// Protected routes - require authentication
router.use(protect);

router.get('/admin/stats', getTestimonialStats);
router.post('/', createTestimonial);
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);
router.patch('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/toggle-active', toggleActive);
router.patch('/:id/toggle-featured', toggleFeatured);

export default router;