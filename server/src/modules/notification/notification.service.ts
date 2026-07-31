import nodemailer from 'nodemailer';
import { NotificationModel, INotification } from './notification.model';

// Email Transporter Config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
});

export class NotificationService {
  static async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      if (process.env.SMTP_USER && process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: `"ClassConnect" <${process.env.SMTP_USER}>`,
          to,
          subject,
          text,
          html: html || `<p>${text}</p>`,
        });
      } else {
        console.log(`[EMAIL MOCK FALLBACK] To: ${to} | Subject: ${subject} | Message: ${text}`);
      }
    } catch (err) {
      console.warn('[EMAIL WARNING] Failed to dispatch email, continuing with in-app notification:', err);
    }
  }

  static async createNotification(payload: {
    userId: string;
    title: string;
    message: string;
    type?: 'system' | 'payment' | 'live' | 'report';
    link?: string;
    userEmail?: string;
  }) {
    const notif = new NotificationModel({
      user: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'system',
      link: payload.link || '',
      isRead: false,
    });

    await notif.save();

    if (payload.userEmail) {
      await NotificationService.sendEmail(payload.userEmail, payload.title, payload.message);
    }

    return notif;
  }

  static async getUserNotifications(userId: string): Promise<INotification[]> {
    return NotificationModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);
  }

  static async markAsRead(userId: string, notificationId: string): Promise<INotification> {
    const notif = await NotificationModel.findOne({ _id: notificationId, user: userId });
    if (!notif) {
      throw new Error('Notification not found.');
    }
    notif.isRead = true;
    await notif.save();
    return notif;
  }

  static async markAllAsRead(userId: string) {
    return NotificationModel.updateMany({ user: userId, isRead: false }, { isRead: true });
  }
}
