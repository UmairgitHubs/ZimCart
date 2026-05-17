import { Router } from 'express';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as voucherController from '../controllers/voucher.controller.js';
import * as voucherSchemas from '../validators/voucher.schema.js';
const router = Router();
router.use(verifyJWT);
router.use(restrictTo('ADMIN', 'STORE_MANAGER'));
router.get('/', voucherController.listVouchers);
router.post('/', validateRequest(voucherSchemas.createVoucherSchema), voucherController.createVoucher);
router.patch('/:id', validateRequest(voucherSchemas.updateVoucherSchema), voucherController.updateVoucher);
router.delete('/:id', validateRequest(voucherSchemas.voucherIdParamSchema), voucherController.deleteVoucher);
export default router;
//# sourceMappingURL=voucher.routes.js.map