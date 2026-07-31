import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';
import { uploadMultipleImages } from '../../middlewares/upload.middleware';

const router = Router();

// Student APIs
router.post('/', authenticateUser, uploadMultipleImages, ReportController.createReport);
router.get('/my', authenticateUser, ReportController.getMyReports);

// Admin APIs
router.get('/', authenticateUser, authorizeRoles('admin'), ReportController.getAllReportsAdmin);
router.put('/:id/status', authenticateUser, authorizeRoles('admin'), ReportController.updateStatus);

export const reportRouter = router;
