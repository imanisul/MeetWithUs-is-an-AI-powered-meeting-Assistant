import {Router } from "express";

import { getProfile } from '../controllers/user.controller.js';

import verifyJWT from '../middleware/auth.middleware.js';

const router = Router();


router.get('/me', verifyJWT, getProfile);

export default router;