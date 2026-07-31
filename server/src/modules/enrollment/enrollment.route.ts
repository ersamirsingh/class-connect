import { Router } from 'express';
import { EnrollmentController } from './enrollment.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my', authenticateUser, EnrollmentController.getMyEnrollments);
router.post('/progress/complete', authenticateUser, EnrollmentController.markComplete);
router.get('/certificate/:courseId', authenticateUser, EnrollmentController.getCertificate);

export const enrollmentRouter = router;
