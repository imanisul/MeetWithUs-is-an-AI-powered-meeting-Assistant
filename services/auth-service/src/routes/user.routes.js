import {Router } from "express";

import { getProfile, updateProfile } from '../controllers/user.controller.js';

import verifyJWT from '../middleware/auth.middleware.js';

const router = Router();


router.get('/me', verifyJWT, getProfile);
router.put('/me', verifyJWT, updateProfile);

export default router;