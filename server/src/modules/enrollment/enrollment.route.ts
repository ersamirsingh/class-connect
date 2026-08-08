import { Router } from 'express';
import { EnrollmentController } from './enrollment.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my', authenticateUser, EnrollmentController.getMyEnrollments);
router.get('/verify-public/:uniqueId', EnrollmentController.verifyPublicCertificate);
router.get('/status/:courseId', authenticateUser, EnrollmentController.checkStatus);
router.get('/unlock-status/:courseId', authenticateUser, EnrollmentController.getTopicUnlockStatus);
router.get('/playback/:courseId/:lectureId', authenticateUser, EnrollmentController.getLecturePlayback);
router.post('/progress/complete', authenticateUser, EnrollmentController.markComplete);
router.get('/certificate/:courseId', authenticateUser, EnrollmentController.getCertificate);

export const enrollmentRouter = router;
