// routes/visaApplication.routes.ts
import express from 'express';
import {
  submitVisaApplication,
  getAllVisaApplications,
  getVisaApplication,
  getMyVisaApplications,
  updateVisaApplicationStatus,
  deleteVisaApplication,
  getVisaApplicationStats,
} from '../controllers/visaApplication.controller';
import { uploadVisaFiles } from '../middleware/upload';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes
router.post('/', uploadVisaFiles, submitVisaApplication);

// Protected routes - require authentication
router.use(protect);

// All authenticated routes (same as before - no role checking)
router.get('/my-applications', getMyVisaApplications);
router.get('/admin/stats', getVisaApplicationStats);
router.get('/:id', getVisaApplication);
router.get('/', getAllVisaApplications);
router.patch('/:id', updateVisaApplicationStatus);
router.delete('/:id', deleteVisaApplication);

export default router;