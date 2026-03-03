import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Protected routes (Admin only/Authorized users)
router.post('/multiple', verifyJWT, upload.array('images', 10), uploadController.uploadImages);
router.post('/single', verifyJWT, upload.single('image'), uploadController.uploadImage);

export default router;
