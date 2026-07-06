import {Router} from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/document.controller.js';


const router = Router();

const upload = multer({
    dest: 'src/uploads/',
});

router.post('/upload', upload.single('document'), uploadDocument);

export default router;