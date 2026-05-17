import { Router } from 'express';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  updateAvailabilitySchema,
  updateJobStatusSchema,
  updateRiderProfileSchema,
  updateLocationSchema,
  pushTokenSchema,
  requestPayoutSchema,
} from '../validators/rider-mobile.schema.js';
import * as payoutController from '../controllers/rider-payout.controller.js';
import * as riderMobileController from '../controllers/rider-mobile.controller.js';

const router = Router();

router.use(verifyJWT, restrictTo('RIDER'));

router.get('/me', riderMobileController.getMe);
router.get('/jobs', riderMobileController.getJobs);
router.get('/jobs/:orderId', riderMobileController.getJobById);
router.patch(
  '/availability',
  validateRequest(updateAvailabilitySchema),
  riderMobileController.updateAvailability
);
router.patch(
  '/jobs/:orderId/status',
  validateRequest(updateJobStatusSchema),
  riderMobileController.updateJobStatus
);
router.get('/earnings', riderMobileController.getEarnings);
router.get('/notifications', riderMobileController.getNotifications);
router.patch('/notifications/read-all', riderMobileController.markAllNotificationsRead);
router.patch('/notifications/:id/read', riderMobileController.markNotificationRead);
router.patch('/profile', validateRequest(updateRiderProfileSchema), riderMobileController.updateProfile);
router.post('/push-token', validateRequest(pushTokenSchema), riderMobileController.updatePushToken);
router.post('/location', validateRequest(updateLocationSchema), riderMobileController.updateLocation);
router.get('/wallet', payoutController.getWallet);
router.post('/payouts', validateRequest(requestPayoutSchema), payoutController.requestPayout);

export default router;
