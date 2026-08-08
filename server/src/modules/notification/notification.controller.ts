import { Response } from 'express';
import { NotificationService } from './notification.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const list = await NotificationService.getUserNotifications(userId);
      res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const id = req.params.id as string;
      const notif = await NotificationService.markAsRead(userId, id);
      res.status(200).json({ success: true, data: notif });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async markAllRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      await NotificationService.markAllAsRead(userId);
      res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async broadcastLiveAlert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId, courseTitle, liveUrl } = req.body;
      const result = await NotificationService.notifyStudentsLiveStart(courseId || 'general', courseTitle || 'Live Class', liveUrl);
      res.status(200).json({ success: true, message: `Live notification sent to ${result.count} students!`, count: result.count });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async scheduleLiveAlert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId, courseTitle, startTime, topic } = req.body;
      const result = await NotificationService.notifyStudentsScheduledLiveClass(courseId || 'general', courseTitle || 'Live Class', startTime, topic);
      res.status(200).json({ success: true, message: `Scheduled live class alert sent to ${result.count} students!`, count: result.count });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
