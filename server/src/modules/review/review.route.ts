import { Router } from 'express';
import { ReviewController } from './review.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/course/:courseId', ReviewController.getCourseReviews);
router.post('/', authenticateUser, ReviewController.addReview);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), ReviewController.deleteReview);

export const reviewRouter = router;
