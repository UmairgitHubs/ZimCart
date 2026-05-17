import { Router } from 'express';
import * as riderController from '../controllers/rider.controller.js';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as riderSchemas from '../validators/rider.schema.js';
const router = Router();
router.use(verifyJWT);
router.get('/', restrictTo('ADMIN', 'STORE_MANAGER'), riderController.listRiders);
router.post('/', restrictTo('ADMIN'), validateRequest(riderSchemas.createRiderSchema), riderController.createRider);
router.patch('/:id', restrictTo('ADMIN'), validateRequest(riderSchemas.updateRiderSchema), riderController.updateRider);
router.delete('/:id', restrictTo('ADMIN'), riderController.deleteRider);
export default router;
//# sourceMappingURL=rider.routes.js.map