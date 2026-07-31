import { Router } from 'express';
import { CourseController } from './course.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', CourseController.getCourses);
router.get('/:idOrSlug', CourseController.getCourseByIdOrSlug);

// Admin CRUD routes
router.get('/admin/all', authenticateUser, authorizeRoles('admin'), CourseController.getAllCoursesAdmin);
router.post('/', authenticateUser, authorizeRoles('admin'), CourseController.createCourse);
router.put('/:id', authenticateUser, authorizeRoles('admin'), CourseController.updateCourse);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), CourseController.deleteCourse);

export const courseRouter = router;
