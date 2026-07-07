import {Router} from 'express';

import { createAgenda } from '../controllers/ai.controller.js';
import { searchDocuments } from '../controllers/document.controller.js';

const router = Router();

router.post('/generate-agenda', createAgenda);
router.get('/search', searchDocuments);

export default router;