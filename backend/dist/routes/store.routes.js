import { Router } from 'express';
import * as storeController from '../controllers/store.controller.js';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as storeAdminSchemas from '../validators/storeAdmin.schema.js';
const router = Router();
// Public routes for Mart Discovery
router.get('/', storeController.getStores);
// Staff mart settings — must be registered before `/:id` so "admin" is not captured as an id
router.get('/admin/settings', verifyJWT, restrictTo('ADMIN', 'STORE_MANAGER'), storeController.getStoreSettings);
router.patch('/admin/settings', verifyJWT, restrictTo('ADMIN', 'STORE_MANAGER'), validateRequest(storeAdminSchemas.updateStoreSettingsSchema), storeController.updateStoreSettings);
router.get('/admin/directory', verifyJWT, restrictTo('ADMIN'), storeController.getMartsAdminDirectory);
router.get('/:id', storeController.getStoreDetails);
export default router;
//# sourceMappingURL=store.routes.js.map