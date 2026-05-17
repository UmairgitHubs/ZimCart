import { Router } from 'express';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as paymentController from '../controllers/payment.controller.js';
import * as schemas from '../validators/payment.schema.js';

const router = Router();

router.use(verifyJWT);
router.use(restrictTo('ADMIN', 'STORE_MANAGER'));

router.get('/', validateRequest(schemas.listPaymentsSchema), paymentController.listPayments);
router.patch('/:id', validateRequest(schemas.updatePaymentSchema), paymentController.updatePayment);
router.post(
  '/:id/reconcile',
  validateRequest(schemas.reconcilePaymentSchema),
  paymentController.reconcilePayment
);
router.delete('/:id', validateRequest(schemas.paymentIdSchema), paymentController.deletePayment);

export default router;
