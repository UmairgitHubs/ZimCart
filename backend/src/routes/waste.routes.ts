import { Router } from 'express';
import * as wasteController from '../controllers/waste.controller.js';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as wasteSchemas from '../validators/waste.schema.js';

const router = Router();

router.use(verifyJWT, restrictTo('ADMIN', 'STORE_MANAGER'));

router.get('/', validateRequest(wasteSchemas.listWasteLogsSchema), wasteController.listWasteLogs);
router.post('/', validateRequest(wasteSchemas.createWasteLogSchema), wasteController.createWasteLog);
router.patch('/:id', validateRequest(wasteSchemas.updateWasteLogSchema), wasteController.updateWasteLog);
router.delete('/:id', wasteController.deleteWasteLog);

export default router;
