import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all admin endpoints with admin role
router.use(authenticateUser, authorizeRoles('admin'));

router.get('/admins', AdminController.getAdmins);
router.post('/admins', AdminController.createAdmin);
router.put('/admins/:id/deactivate', AdminController.deactivateAdmin);

router.get('/students', AdminController.getStudents);
router.put('/users/:id/toggle-status', AdminController.toggleUserStatus);

router.get('/stats', AdminController.getStats);

router.get('/payments', AdminController.getPayments);
router.put('/payments/:id/refund', AdminController.refundOrder);

router.get('/courses/:courseId/students', AdminController.getCourseEnrollments);

export const adminRouter = router;
