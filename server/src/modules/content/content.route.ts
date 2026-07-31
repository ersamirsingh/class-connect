import { Router } from 'express';
import { ContentController } from './content.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', ContentController.getPublicContent);

// Admin CMS CRUD routes
router.get('/admin/all', authenticateUser, authorizeRoles('admin'), ContentController.getAllContentAdmin);
router.post('/admin', authenticateUser, authorizeRoles('admin'), ContentController.createContentBlock);
router.put('/admin/:id', authenticateUser, authorizeRoles('admin'), ContentController.updateContentBlock);
router.delete('/admin/:id', authenticateUser, authorizeRoles('admin'), ContentController.deleteContentBlock);

export const contentRouter = router;
