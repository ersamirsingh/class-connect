import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateUser);

router.get('/', NotificationController.getNotifications);
router.put('/:id/read', NotificationController.markRead);
router.put('/read-all', NotificationController.markAllRead);

// Admin Live & Scheduled Notification Endpoints
router.post('/broadcast-live', authorizeRoles('admin'), NotificationController.broadcastLiveAlert);
router.post('/schedule-live', authorizeRoles('admin'), NotificationController.scheduleLiveAlert);

export const notificationRouter = router;
