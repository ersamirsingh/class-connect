import { Router } from 'express';
import { DocumentVerificationController } from './documentVerification.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Student Routes
router.post('/submit', authenticateUser, DocumentVerificationController.submitVerification);
router.get('/my-status', authenticateUser, DocumentVerificationController.getStudentVerification);

// Admin Routes
router.get('/admin/queue', authenticateUser, authorizeRoles('admin'), DocumentVerificationController.getAdminQueue);
router.post('/admin/review/:id', authenticateUser, authorizeRoles('admin'), DocumentVerificationController.reviewVerification);

export const verificationRouter = router;
