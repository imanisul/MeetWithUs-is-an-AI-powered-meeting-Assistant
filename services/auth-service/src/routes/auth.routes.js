import {Router} from 'express';
import { register, login, getAllUsers } from '../controllers/auth.controller.js';
import { getOrganization, inviteMember, updateMemberRole } from '../controllers/organization.controller.js';
import verifyJWT from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', verifyJWT, getAllUsers);

// Organization Routes
router.get('/organization', verifyJWT, getOrganization);
router.post('/organization/invite', verifyJWT, requireRole(['ORG_ADMIN']), inviteMember);
router.put('/organization/role', verifyJWT, requireRole(['ORG_ADMIN']), updateMemberRole);

export default router;