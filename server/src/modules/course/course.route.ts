import { Router } from 'express';
import { CourseController } from './course.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', CourseController.getCourses);
router.get('/suggested', CourseController.getSuggestedCourses);

// Admin CRUD routes (must be before /:idOrSlug)
router.get('/admin/all', authenticateUser, authorizeRoles('admin'), CourseController.getAllCoursesAdmin);
router.post('/', authenticateUser, authorizeRoles('admin'), CourseController.createCourse);
router.put('/toggle-suggested/:id', authenticateUser, authorizeRoles('admin'), CourseController.toggleSuggested);
router.put('/:id', authenticateUser, authorizeRoles('admin'), CourseController.updateCourse);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), CourseController.deleteCourse);

// Dynamic param route (must be last)
router.get('/:idOrSlug', CourseController.getCourseByIdOrSlug);

export const courseRouter = router;
