import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateUser);

router.get('/', NotificationController.getNotifications);
router.put('/:id/read', NotificationController.markRead);
router.put('/read-all', NotificationController.markAllRead);

export const notificationRouter = router;
