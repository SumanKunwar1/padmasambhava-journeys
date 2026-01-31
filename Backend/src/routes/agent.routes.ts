// routes/agent.routes.ts
import express from 'express';
import {
  createAgent,
  getAllAgents,
  getAgent,
  updateAgent,
  deleteAgent,
  getAgentStats,
  approveAgent,
  rejectAgent,
} from '../controllers/agent.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes
router.post('/', createAgent);

// Protected routes - require authentication
router.use(protect);

router.get('/admin/stats', getAgentStats);
router.patch('/:id/approve', approveAgent);
router.patch('/:id/reject', rejectAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgent);
router.patch('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;