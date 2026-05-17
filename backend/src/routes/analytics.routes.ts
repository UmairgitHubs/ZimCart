import { Router } from 'express';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = Router();

router.use(verifyJWT);

router.get('/overview', restrictTo('ADMIN', 'STORE_MANAGER'), analyticsController.getOverview);
router.get('/insights', restrictTo('ADMIN', 'STORE_MANAGER'), analyticsController.getInsights);
router.get('/activity', restrictTo('ADMIN', 'STORE_MANAGER'), analyticsController.getRecentActivity);

export default router;
