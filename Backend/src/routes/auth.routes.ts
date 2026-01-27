// routes/auth.routes.ts
import express from 'express';
import { login, logout, getMe, protect } from '../controllers/auth.controller';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.use(protect); // All routes after this are protected
router.post('/logout', logout);
router.get('/me', getMe);

export default router;