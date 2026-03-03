import { Router } from 'express';
import customerRoutes from './customer.routes.js';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import helpRoutes from './help.routes.js';
import productRoutes from './product.routes.js';
import uploadRoutes from './upload.routes.js';
import inventoryRoutes from './inventory.routes.js';
import categoryRoutes from './category.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/health', healthRoutes);
router.use('/help', helpRoutes);
router.use('/products', productRoutes);
router.use('/upload', uploadRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/categories', categoryRoutes);

export default router;
