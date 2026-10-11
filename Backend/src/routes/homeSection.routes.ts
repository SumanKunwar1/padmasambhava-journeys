// routes/homeSection.routes.ts
import express from 'express';
import {
  getHomeSection,
  getAllHomeSections,
  updateHomeSection,
} from '../controllers/homeSection.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Admin overview of every section (protected)
router.get('/', protect, getAllHomeSections);

router.route('/:key')
  .get(getHomeSection)               // Public - for the homepage
  .put(protect, updateHomeSection);  // Protected - admin only

export default router;
