import { Router } from 'express';
import { verifyJWTOptional } from '../middlewares/auth.middleware.js';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

// Allow public read access via verifyJWTOptional
router.get('/', verifyJWTOptional, categoryController.getCategories);

// Secured write routes
router.post('/', verifyJWTOptional, categoryController.createCategory);

router.route('/:id')
  .put(verifyJWTOptional, categoryController.updateCategory)
  .delete(verifyJWTOptional, categoryController.deleteCategory);

export default router;
