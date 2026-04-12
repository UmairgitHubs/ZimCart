import { Router } from 'express';
import customerRoutes from './customer.routes.js';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import helpRoutes from './help.routes.js';
import productRoutes from './product.routes.js';
import uploadRoutes from './upload.routes.js';
import inventoryRoutes from './inventory.routes.js';
import categoryRoutes from './category.routes.js';
import storeRoutes from './store.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import voucherRoutes from './voucher.routes.js';
import analyticsRoutes from './analytics.routes.js';
import riderRoutes from './rider.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/customer', customerRoutes); // Alias for backward compatibility
router.use('/customers', customerRoutes);
router.use('/health', healthRoutes);
router.use('/help', helpRoutes);
router.use('/products', productRoutes);
router.use('/upload', uploadRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/categories', categoryRoutes);
router.use('/marts', storeRoutes);
router.use('/orders', orderRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/riders', riderRoutes);

export default router;
