import { Router } from 'express';
import { z } from 'zod';
import * as productController from '../controllers/product.controller.js';
import { verifyJWT, verifyJWTOptional } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { productSchema, productBodySchema } from '../validators/product.schema.js';
const router = Router();
// Public routes (for the marketplace)
router.get('/', verifyJWTOptional, productController.getProducts);
router.get('/:id', verifyJWTOptional, productController.getProduct);
// Protected routes (for Admin Dashboard)
// Note: In a production app, we'd also add a checkRole(['ADMIN', 'STORE_MANAGER']) middleware
router.post('/', verifyJWT, validateRequest(productSchema), productController.createProduct);
router.patch('/:id', verifyJWT, validateRequest(z.object({ body: productBodySchema.partial() })), productController.updateProduct);
router.delete('/:id', verifyJWT, productController.deleteProduct);
export default router;
//# sourceMappingURL=product.routes.js.map