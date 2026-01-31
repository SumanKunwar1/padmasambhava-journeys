// routes/insurance.routes.ts
import express from 'express';
import {
  getAllInsurance,
  getInsuranceById,
  createInsurance,
  updateInsurance,
  approveInsurance,
  deleteInsurance,
  getInsuranceStats,
} from '../controllers/insurance.controller';
import { protect } from '../controllers/auth.controller';
import { upload } from '../middleware/upload';

const router = express.Router();

// Middleware for multiple file uploads (passport + medical documents)
const uploadInsuranceFiles = upload.fields([
  { name: 'passportCopy', maxCount: 1 },
  { name: 'medicalDocuments', maxCount: 5 },
]);

// Public route - Create insurance application
router.post('/', uploadInsuranceFiles, createInsurance);

// Protected admin routes
router.use(protect); // All routes after this require authentication

router.get('/stats', getInsuranceStats);
router.get('/', getAllInsurance);
router.get('/:id', getInsuranceById);
router.patch('/:id', uploadInsuranceFiles, updateInsurance);
router.patch('/:id/approve', approveInsurance);
router.delete('/:id', deleteInsurance);

export default router;