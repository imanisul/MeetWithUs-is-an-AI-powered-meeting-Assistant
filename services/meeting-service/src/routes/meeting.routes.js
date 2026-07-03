import { Router } from 'express';

import verifyJWT from '../middleware/auth.middleware.js'

import { createMeeting } from '../controllers/meeting.controller.js';

const router = Router();

router.post('/', verifyJWT, createMeeting);

export default router;


