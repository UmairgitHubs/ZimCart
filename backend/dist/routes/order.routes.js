import { Router } from 'express';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';
const router = Router();
// Protect all routes
router.use(verifyJWT);
// Both ADMIN and STORE_MANAGER can view and update orders
router.get('/', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.getAllOrders);
router.get('/stats', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.getOrderStats);
router.post('/', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.createManualOrder);
router.put('/:orderId', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.updateOrder);
router.patch('/:orderId/status', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.updateOrderStatus);
router.delete('/:orderId', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.deleteOrder);
export default router;
//# sourceMappingURL=order.routes.js.map