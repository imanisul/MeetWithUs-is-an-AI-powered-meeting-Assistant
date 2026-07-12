import { Router } from 'express';
import { getNotifications, markAllRead } from '../controllers/notification.controller.js';
import verifyJWT from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyJWT, getNotifications);
router.put('/mark-all-read', verifyJWT, markAllRead);

export default router;
