import { NotificationModel } from '../../modules/notification/notification.model';
import { SeededUsers } from './seedUsers';

export async function seedNotifications(users: SeededUsers) {
  console.log('🔔 Seeding Notifications...');

  const notificationsData = [
    {
      user: users.student1._id,
      title: 'Payment Successful',
      message: 'Your payment for Applied Mathematics Masterclass was successful. You now have full lifetime access!',
      type: 'payment' as const,
      link: '/course/applied-mathematics-masterclass/explore',
      isRead: true,
    },
    {
      user: users.student1._id,
      title: 'Live Class Reminder',
      message: 'Live class "Statistics & Probability" is starting soon. Click to join the interactive stream.',
      type: 'live' as const,
      link: '/course/applied-mathematics-masterclass/explore',
      isRead: false,
    },
    {
      user: users.student3._id,
      title: 'Payment Under Processing',
      message: 'Your payment for Intro to Data Science is being processed via Razorpay. We will update you shortly.',
      type: 'payment' as const,
      link: '/payments',
      isRead: false,
    },
    {
      user: users.student4._id,
      title: 'Report Status Updated',
      message: 'Your problem report regarding payment charge status is currently in-progress with our admin team.',
      type: 'report' as const,
      link: '/report',
      isRead: false,
    },
  ];

  for (const item of notificationsData) {
    let notification = await NotificationModel.findOne({
      user: item.user,
      title: item.title,
    });

    if (!notification) {
      await NotificationModel.create(item);
      console.log(`  ✓ Created notification for user: ${item.user} ("${item.title}")`);
    } else {
      console.log(`  ℹ Notification already exists for user: ${item.user}`);
    }
  }
}
