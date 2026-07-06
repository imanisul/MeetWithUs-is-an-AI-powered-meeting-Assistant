import { Router } from 'express';

import verifyJWT from '../middleware/auth.middleware.js'

import { createMeeting, updateAI } from '../controllers/meeting.controller.js';

const router = Router();

router.post('/', verifyJWT, createMeeting);

router.put('/:id/ai', updateAI);

export default router;


