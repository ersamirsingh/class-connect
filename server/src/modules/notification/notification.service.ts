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

  // Notify enrolled/all students when Admin goes live right now
  static async notifyStudentsLiveStart(courseId: string, courseTitle: string, liveUrl?: string) {
    try {
      let enrollments = await EnrollmentModel.find({ course: courseId, status: 'active' });
      let studentIds = enrollments.map(e => e.student);

      if (studentIds.length === 0) {
        const allStudents = await UserModel.find({ role: 'student', isActive: true });
        studentIds = allStudents.map(s => s._id);
      }

      const notifications = studentIds.map(sid => ({
        user: sid,
        title: `🔴 Admin is LIVE NOW: ${courseTitle}`,
        message: `Your instructor has just gone live for "${courseTitle}". Click to join the interactive live session immediately!`,
        type: 'live',
        link: liveUrl || `/courses/${courseId}`,
        isRead: false,
      }));

      if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
        console.log(`📡 Broadcasted live alert for "${courseTitle}" to ${notifications.length} students.`);
      }
      return { count: notifications.length };
    } catch (err) {
      console.error('Error notifying students on live start:', err);
      return { count: 0 };
    }
  }

  // Notify students when Admin schedules a future live class
  static async notifyStudentsScheduledLiveClass(courseId: string, courseTitle: string, startTime: string, topic?: string) {
    try {
      const allStudents = await UserModel.find({ role: 'student', isActive: true });
      const formattedDate = new Date(startTime).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const notifications = allStudents.map(s => ({
        user: s._id,
        title: `📅 Live Class Scheduled: ${courseTitle}`,
        message: `A live class "${topic || courseTitle}" is scheduled for ${formattedDate}. Mark your calendar!`,
        type: 'live',
        link: `/courses/${courseId}`,
        isRead: false,
      }));

      if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
        console.log(`📅 Scheduled live class alert dispatched to ${allStudents.length} students.`);
      }
      return { count: notifications.length };
    } catch (err) {
      console.error('Error dispatching scheduled live class alert:', err);
      return { count: 0 };
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
