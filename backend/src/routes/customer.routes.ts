import { Router } from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
// const controller = new CustomerController(); // Removed

// All routes are protected
router.use(verifyJWT);

import { validateRequest } from '../middlewares/validate.middleware.js';
import * as schemas from '../validators/customer.schema.js';
import { restrictTo } from '../middlewares/auth.middleware.js';

// --- ADMIN DASHBOARD ROUTES ---
router.get('/admin/all', restrictTo('ADMIN', 'STORE_MANAGER'), customerController.getAllCustomersForAdmin);
router.post('/admin/create', restrictTo('ADMIN'), customerController.createCustomerForAdmin);
router.patch('/admin/:id', restrictTo('ADMIN', 'STORE_MANAGER'), customerController.updateCustomerForAdmin);
router.delete('/admin/:id', restrictTo('ADMIN', 'STORE_MANAGER'), customerController.deleteCustomerForAdmin);

// Profile
router.get('/profile', customerController.getProfile);
router.patch('/profile', validateRequest(schemas.updateProfileSchema), customerController.updateProfile);
router.post('/push-token', customerController.updatePushToken);

// Orders
router.get('/orders', validateRequest(schemas.getOrdersSchema), customerController.getOrders);
router.post('/orders/preview', validateRequest(schemas.previewOrderSchema), customerController.previewOrder);
router.post('/orders', validateRequest(schemas.placeOrderSchema), customerController.placeOrder);
router.get(
  '/orders/:id/tracking',
  validateRequest(schemas.getOrderTrackingSchema),
  customerController.getOrderTracking
);

// Vouchers
router.get('/vouchers', validateRequest(schemas.getVouchersSchema), customerController.getVouchers);
router.post('/vouchers/validate', customerController.validateVoucher);

// Favourites
router.get('/favourites', customerController.getFavourites); 
router.post('/favourites/:productId', validateRequest(schemas.toggleFavouriteSchema), customerController.toggleFavourite);

// Addresses
router.get('/addresses', customerController.getAddresses);
router.post('/addresses', validateRequest(schemas.addAddressSchema), customerController.addAddress);
router.put('/addresses/:id', validateRequest(schemas.updateAddressSchema), customerController.updateAddress);
router.delete('/addresses/:id', customerController.deleteAddress);

// Payment Methods
router.get('/payment-methods', customerController.getPaymentMethods);
router.post('/payment-methods', validateRequest(schemas.addPaymentMethodSchema), customerController.addPaymentMethod);
router.patch('/payment-methods/:id/default', customerController.setDefaultPaymentMethod);
router.delete('/payment-methods/:id', customerController.deletePaymentMethod);

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
