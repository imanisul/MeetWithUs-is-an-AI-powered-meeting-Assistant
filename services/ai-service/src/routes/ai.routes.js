import {Router} from 'express';

import { createAgenda } from '../controllers/ai.controller.js';

const router = Router();

router.post('/generate-agenda', createAgenda);

export default router;