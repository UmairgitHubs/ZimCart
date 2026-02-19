import { Router } from 'express';
import { customerController } from '../controllers/customer.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

// customerController is exported as an instance from the controller file.
// The file exported class CustomerController and const customerController.
// I should use the instance.

const router = Router();
// const controller = new CustomerController(); // Removed

// All routes are protected
router.use(verifyJWT);

import { validateRequest } from '../middlewares/validate.middleware.js';
import * as schemas from '../validators/customer.schema.js';

// Profile
router.get('/profile', customerController.getProfile);
router.patch('/profile', validateRequest(schemas.updateProfileSchema), customerController.updateProfile);

// Orders
router.get('/orders', validateRequest(schemas.getOrdersSchema), customerController.getOrders);

// Vouchers
router.get('/vouchers', validateRequest(schemas.getVouchersSchema), customerController.getVouchers);

// Favourites
router.get('/favourites', customerController.getFavourites); // No params to validate for GET all
router.post('/favourites/:productId', validateRequest(schemas.toggleFavouriteSchema), customerController.toggleFavourite);

export default router;
