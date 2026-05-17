import { Router } from 'express';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { assignRiderSchema } from '../validators/order.schema.js';
import * as orderController from '../controllers/order.controller.js';
import * as dispatchController from '../controllers/dispatch.controller.js';

const router = Router();

// Protect all routes
router.use(verifyJWT);

// Both ADMIN and STORE_MANAGER can view and update orders
router.get('/', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.getAllOrders);
router.get('/stats', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.getOrderStats);
router.get(
    '/:orderId/dispatch-candidates',
    restrictTo('ADMIN', 'STORE_MANAGER'),
    dispatchController.getDispatchCandidates
);
router.post('/', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.createManualOrder);
router.put('/:orderId', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.updateOrder);
router.patch('/:orderId/status', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.updateOrderStatus);
router.patch(
    '/:orderId/assign-rider',
    restrictTo('ADMIN', 'STORE_MANAGER'),
    validateRequest(assignRiderSchema),
    orderController.assignRider
);
router.post(
    '/:orderId/auto-dispatch',
    restrictTo('ADMIN', 'STORE_MANAGER'),
    dispatchController.autoDispatch
);
router.patch(
    '/:orderId/unassign-rider',
    restrictTo('ADMIN', 'STORE_MANAGER'),
    orderController.unassignRider
);
router.delete('/:orderId', restrictTo('ADMIN', 'STORE_MANAGER'), orderController.deleteOrder);

export default router;
