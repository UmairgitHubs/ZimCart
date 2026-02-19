import { Router } from 'express';
import customerRoutes from './customer.routes.js';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/customer', customerRoutes);
router.use('/health', healthRoutes);

export default router;
