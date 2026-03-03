import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

// In a real app, only Admins should write, but read could be public if needed.
// For the dashboard, we secure everything under auth.
router.use(verifyJWT);

router.route('/')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router.route('/:id')
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
