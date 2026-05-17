import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.use(verifyJWT); // Secure all inventory routes
router.get('/', inventoryController.getInventory);
router.patch('/:id', inventoryController.updateStock);
router.get('/:id/history', inventoryController.getHistory);
router.delete('/:id', inventoryController.deleteInventory);
export default router;
//# sourceMappingURL=inventory.routes.js.map