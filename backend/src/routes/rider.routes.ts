import { Router } from 'express';
import * as riderController from '../controllers/rider.controller.js';
import * as dispatchController from '../controllers/dispatch.controller.js';
import * as payoutController from '../controllers/rider-payout.controller.js';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as riderSchemas from '../validators/rider.schema.js';

const router = Router();

router.use(verifyJWT);

router.get('/', restrictTo('ADMIN', 'STORE_MANAGER'), riderController.listRiders);
router.get('/live-map', restrictTo('ADMIN', 'STORE_MANAGER'), dispatchController.getLiveMap);
router.get('/payouts', restrictTo('ADMIN'), payoutController.listAdmin);
router.patch('/payouts/:id', restrictTo('ADMIN'), payoutController.updateAdmin);
router.post('/', restrictTo('ADMIN'), validateRequest(riderSchemas.createRiderSchema), riderController.createRider);
router.patch('/:id', restrictTo('ADMIN'), validateRequest(riderSchemas.updateRiderSchema), riderController.updateRider);
router.delete('/:id', restrictTo('ADMIN'), riderController.deleteRider);

export default router;
