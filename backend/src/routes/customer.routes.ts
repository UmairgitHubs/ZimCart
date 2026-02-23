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
router.post('/push-token', customerController.updatePushToken);

// Orders
router.get('/orders', validateRequest(schemas.getOrdersSchema), customerController.getOrders);
router.post('/orders', customerController.placeOrder);

// Vouchers
router.get('/vouchers', validateRequest(schemas.getVouchersSchema), customerController.getVouchers);

// Favourites
router.get('/favourites', customerController.getFavourites); 
router.post('/favourites/:productId', validateRequest(schemas.toggleFavouriteSchema), customerController.toggleFavourite);

// Addresses
router.get('/addresses', customerController.getAddresses);
router.post('/addresses', validateRequest(schemas.addAddressSchema), customerController.addAddress);
router.put('/addresses/:id', validateRequest(schemas.updateAddressSchema), customerController.updateAddress);
router.delete('/addresses/:id', customerController.deleteAddress);

// Security & Data
router.get('/notifications', customerController.getNotifications);
router.patch('/notifications/preferences', customerController.updateNotificationPreferences);
router.patch('/notifications/:id/read', customerController.markNotificationRead);
router.post('/notifications/read-all', customerController.markAllNotificationsRead);
router.patch('/security', validateRequest(schemas.updateSecuritySchema), customerController.updateSecuritySettings);
router.post('/account/delete', validateRequest(schemas.deleteAccountSchema), customerController.deleteAccount);
router.post('/data/export', customerController.requestDataExport);
router.post('/data/clear-history', customerController.clearHistory);

// Sessions
router.get('/sessions', customerController.getSessions);
router.delete('/sessions/:id', customerController.revokeSession);
router.delete('/sessions', customerController.revokeAllOtherSessions);

export default router;
