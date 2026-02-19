import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

import { validateRequest } from '../middlewares/validate.middleware.js';
import * as schemas from '../validators/auth.schema.js';

const router = Router();

// Public routes
router.post('/register', validateRequest(schemas.registerSchema), authController.register);
router.post('/login', validateRequest(schemas.loginSchema), authController.login);
router.post('/refresh-token', validateRequest(schemas.refreshTokenSchema), authController.refresh);
router.post('/forgot-password', validateRequest(schemas.forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(schemas.resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post('/logout', verifyJWT, authController.logout);

export default router;
