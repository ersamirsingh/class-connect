import nodemailer from 'nodemailer';
import { NotificationModel, INotification } from './notification.model';
import { UserModel } from '../user/user.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';

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

  // Notify all active students when a new course is launched / created by admin
  static async notifyAllStudentsOnCourseLaunch(course: { _id: any; title: string; slug?: string }) {
    try {
      const students = await UserModel.find({ role: 'student', isActive: true });
      const notifications = students.map(student => ({
        user: student._id,
        title: `🚀 New Course Launched: ${course.title}`,
        message: `A brand new course "${course.title}" has been launched! Check out the curriculum and enroll today.`,
        type: 'system',
        link: `/courses/${course.slug || course._id}`,
        isRead: false,
      }));

      if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
        console.log(`🔔 Dispatched launch notification for "${course.title}" to ${students.length} students.`);
      }
    } catch (err) {
      console.error('Error notifying students on course launch:', err);
    }
  }

  // Notify enrolled students when a live masterclass / lecture is starting
  static async notifyEnrolledStudentsOnLiveLecture(courseId: string, courseTitle: string, lectureTitle: string, liveLink?: string) {
    try {
      const enrollments = await EnrollmentModel.find({ course: courseId, status: 'active' });
      const notifications = enrollments.map(e => ({
        user: e.student,
        title: `🔴 Live Masterclass: ${lectureTitle}`,
        message: `Live lecture "${lectureTitle}" in "${courseTitle}" is now live! Click to join the interactive stream.`,
        type: 'live',
        link: liveLink || `/learn/${courseId}`,
        isRead: false,
      }));

      if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
        console.log(`📡 Dispatched live lecture notification to ${enrollments.length} enrolled students.`);
      }
    } catch (err) {
      console.error('Error notifying students on live lecture:', err);
    }
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
