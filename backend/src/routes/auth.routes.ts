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
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', validateRequest(schemas.resetPasswordSchema), authController.resetPassword);
router.post('/verify-2fa', authController.verify2FA);
router.post('/resend-2fa', authController.resend2FA);

// Protected routes
router.post('/logout', verifyJWT, authController.logout);
router.post('/change-password', verifyJWT, validateRequest(schemas.changePasswordSchema), authController.changePassword);
router.get('/me', verifyJWT, authController.getMe);

export default router;
