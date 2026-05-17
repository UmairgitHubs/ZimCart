import { Router } from 'express';
import * as helpController from '../controllers/help.controller.js';
import { verifyJWT, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import * as helpTicketSchemas from '../validators/helpTicket.schema.js';
const router = Router();
// Public route for FAQs
router.get('/faqs', helpController.getFAQs);
// Protected routes for tickets
router.use(verifyJWT);
router.post('/tickets', helpController.createTicket);
router.get('/tickets/admin', restrictTo('ADMIN', 'STORE_MANAGER'), helpController.listTicketsAdmin);
router.post('/tickets/admin', restrictTo('ADMIN', 'STORE_MANAGER'), validateRequest(helpTicketSchemas.createAdminTicketSchema), helpController.createTicketAdmin);
router.patch('/tickets/:id', restrictTo('ADMIN', 'STORE_MANAGER'), validateRequest(helpTicketSchemas.updateAdminTicketSchema), helpController.updateTicketAdmin);
export default router;
//# sourceMappingURL=help.routes.js.map