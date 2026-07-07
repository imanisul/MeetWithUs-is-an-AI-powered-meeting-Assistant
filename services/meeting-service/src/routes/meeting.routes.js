import { Router } from 'express';
import verifyJWT from '../middleware/auth.middleware.js'
import { createMeeting, updateAI } from '../controllers/meeting.controller.js';
import { getAnalytics } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/analytics', verifyJWT, getAnalytics);
router.post('/', verifyJWT, createMeeting);
router.put('/:id/ai', updateAI);

export default router;


