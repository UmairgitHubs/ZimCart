import { Router } from 'express';
import * as storeController from '../controllers/store.controller.js';

const router = Router();

// Public routes for Mart Discovery
router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreDetails);

export default router;
