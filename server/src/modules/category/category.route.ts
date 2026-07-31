import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);

// Admin CRUD routes
router.get('/admin/all', authenticateUser, authorizeRoles('admin'), CategoryController.getAllCategoriesAdmin);
router.post('/', authenticateUser, authorizeRoles('admin'), CategoryController.createCategory);
router.put('/:id', authenticateUser, authorizeRoles('admin'), CategoryController.updateCategory);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), CategoryController.deleteCategory);

export const categoryRouter = router;
