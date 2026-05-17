import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();
// Protect all cart routes
router.use(verifyJWT);
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.patch('/item/:id', cartController.updateCartItem);
router.delete('/item/:id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
export default router;
//# sourceMappingURL=cart.routes.js.map