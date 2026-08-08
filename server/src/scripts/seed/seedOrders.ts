import { OrderModel } from '../../modules/payment/payment.model';
import { UserModel } from '../../modules/user/user.model';
import { CourseModel } from '../../modules/course/course.model';

export async function seedOrders() {
  console.log('💳 Seeding Orders...');

  const student1 = await UserModel.findOne({ email: 'student1@test.com' });
  const student2 = await UserModel.findOne({ email: 'student2@test.com' });
  const student3 = await UserModel.findOne({ email: 'student3@test.com' });
  const student4 = await UserModel.findOne({ email: 'student4@test.com' });

  const courseGoogleAds = await CourseModel.findOne({ slug: 'google-ads' });
  const courseChatGPT = await CourseModel.findOne({ slug: 'chatgpt-ai-tools' });
  const courseCanva = await CourseModel.findOne({ slug: 'canva-mastery' });
  const courseSales = await CourseModel.findOne({ slug: 'sales-lead-generation-skills' });

  if (!student1 || !student2 || !student3 || !student4 || !courseGoogleAds || !courseChatGPT || !courseCanva || !courseSales) {
    throw new Error('Users and Courses must be seeded before seeding orders.');
  }

  const ordersData = [
    {
      student: student1._id,
      course: courseGoogleAds._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_seed_101',
      gatewayPaymentId: 'pay_rzp_seed_101',
      amount: 1499,
      currency: 'INR',
      status: 'success' as const,
      receiptId: 'REC-GOOGLE-ADS-01',
      createdAt: new Date(Date.now() - 20 * 86400000), // 20 days ago
    },
    {
      student: student1._id,
      course: courseChatGPT._id,
      gateway: 'stripe' as const,
      gatewayOrderId: 'cs_test_seed_102',
      gatewayPaymentId: 'pi_test_seed_102',
      amount: 799,
      currency: 'USD',
      status: 'success' as const,
      receiptId: 'REC-CHATGPT-01',
      createdAt: new Date(Date.now() - 15 * 86400000), // 15 days ago
    },
    {
      student: student1._id,
      course: courseCanva._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_seed_106',
      gatewayPaymentId: 'pay_rzp_seed_106',
      amount: 599,
      currency: 'INR',
      status: 'success' as const,
      receiptId: 'REC-CANVA-S1',
      createdAt: new Date(Date.now() - 12 * 86400000),
    },
    {
      student: student1._id,
      course: courseSales._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_seed_107',
      gatewayPaymentId: 'pay_rzp_seed_107',
      amount: 1299,
      currency: 'INR',
      status: 'success' as const,
      receiptId: 'REC-SALES-S1',
      createdAt: new Date(Date.now() - 8 * 86400000),
    },
    {
      student: student2._id,
      course: courseGoogleAds._id,
      gateway: 'stripe' as const,
      gatewayOrderId: 'cs_test_seed_103',
      gatewayPaymentId: 'pi_test_seed_103',
      amount: 1499,
      currency: 'USD',
      status: 'success' as const,
      receiptId: 'REC-GOOGLE-ADS-02',
      createdAt: new Date(Date.now() - 10 * 86400000), // 10 days ago
    },
    {
      student: student3._id,
      course: courseCanva._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_seed_104',
      gatewayPaymentId: '',
      amount: 599,
      currency: 'INR',
      status: 'pending' as const,
      receiptId: 'REC-CANVA-01',
      createdAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
    },
    {
      student: student4._id,
      course: courseSales._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_seed_105',
      gatewayPaymentId: 'pay_failed_seed_105',
      amount: 1299,
      currency: 'INR',
      status: 'failed' as const,
      receiptId: 'REC-SALES-01',
      createdAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
    },
  ];

  for (const o of ordersData) {
    const existing = await OrderModel.findOne({ receiptId: o.receiptId });
    if (!existing) {
      await OrderModel.create(o);
      console.log(`  └─ Created Order: ${o.receiptId} (${o.status})`);
    } else {
      console.log(`  └─ Order already exists: ${o.receiptId}`);
    }
  }

  console.log('✅ Orders Seeding Complete.\n');
}
