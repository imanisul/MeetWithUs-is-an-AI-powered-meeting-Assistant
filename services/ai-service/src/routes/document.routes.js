import {Router} from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments, deleteDocument, addAccess, removeAccess } from '../controllers/document.controller.js';
import verifyJWT from '../middleware/auth.middleware.js';

const router = Router();

const upload = multer({
    dest: 'src/uploads/',
});

router.get('/', verifyJWT, getDocuments);
router.post('/upload', verifyJWT, upload.single('document'), uploadDocument);
router.delete('/:id', verifyJWT, deleteDocument);
router.post('/:id/access', verifyJWT, addAccess);
router.delete('/:id/access/:email', verifyJWT, removeAccess);

export default router;