import { Router } from 'express';
import * as helpController from '../controllers/help.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route for FAQs
router.get('/faqs', helpController.getFAQs);

// Protected routes for tickets
router.use(verifyJWT);
router.post('/tickets', helpController.createTicket);

export default router;
