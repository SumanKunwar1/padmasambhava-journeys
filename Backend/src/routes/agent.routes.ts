// routes/agent.routes.ts
import express from 'express';
import {
  applyAsAgent,
  agentLogin,
  getAllAgents,
  getAgentStats,
  approveAgent,
  rejectAgent,
  updateAgentCredentials,
  deleteAgent,
} from '../controllers/agent.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// ── PUBLIC ─────────────────────────────────────────────────────────────────
router.post('/apply', applyAsAgent);
router.post('/login', agentLogin);

// ── ADMIN PROTECTED ────────────────────────────────────────────────────────
router.use(protect);

// ⭐ Static routes BEFORE :id dynamic routes
router.get('/stats', getAgentStats);
router.get('/', getAllAgents);

router.delete('/:id', deleteAgent);
router.patch('/:id/approve', approveAgent);
router.patch('/:id/reject', rejectAgent);
router.patch('/:id/credentials', updateAgentCredentials);

export default router;