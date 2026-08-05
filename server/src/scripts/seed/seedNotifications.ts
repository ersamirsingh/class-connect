import { NotificationModel } from '../../modules/notification/notification.model';
import { UserModel } from '../../modules/user/user.model';

export async function seedNotifications() {
  console.log('🔔 Seeding Notifications...');

  const student1 = await UserModel.findOne({ email: 'student1@test.com' });
  const student3 = await UserModel.findOne({ email: 'student3@test.com' });
  const student4 = await UserModel.findOne({ email: 'student4@test.com' });

  if (!student1 || !student3 || !student4) {
    throw new Error('Users must be seeded before seeding notifications.');
  }

  const notifications = [
    {
      user: student1._id,
      title: 'Payment Successful',
      message: 'Your payment for Google Ads has been verified. Happy learning!',
      type: 'payment' as const,
      isRead: true,
    },
    {
      user: student1._id,
      title: 'Live Class Starting Soon',
      message: 'Live Session "Scaling Your Ad Spend" is currently LIVE. Click to join now.',
      type: 'live' as const,
      link: '/courses',
      isRead: false,
    },
    {
      user: student3._id,
      title: 'Payment Pending',
      message: 'Your payment for Canva Mastery is currently pending verification.',
      type: 'payment' as const,
      isRead: false,
    },
    {
      user: student4._id,
      title: 'Support Ticket Update',
      message: 'Your report regarding checkout failure is being reviewed by Admin.',
      type: 'report' as const,
      isRead: false,
    },
  ];

  for (const n of notifications) {
    const existing = await NotificationModel.findOne({ user: n.user, title: n.title });
    if (!existing) {
      await NotificationModel.create(n);
      console.log(`  └─ Created Notification for user ${n.user}: ${n.title}`);
    } else {
      console.log(`  └─ Notification already exists: ${n.title}`);
    }
  }

  console.log('✅ Notifications Seeding Complete.\n');
}
