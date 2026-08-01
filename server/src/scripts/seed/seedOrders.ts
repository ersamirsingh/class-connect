import { OrderModel, IOrder } from '../../modules/payment/payment.model';
import { SeededUsers } from './seedUsers';
import { SeededCourses } from './seedCourses';

export interface SeededOrders {
  student1AppliedMathOrder: IOrder;
  student1MernOrder: IOrder;
  student2AppliedMathOrder: IOrder;
  student3DataScienceOrder: IOrder;
  student4UiUxOrder: IOrder;
}

export async function seedOrders(users: SeededUsers, courses: SeededCourses): Promise<SeededOrders> {
  console.log('💳 Seeding Orders...');

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const ordersData = [
    {
      student: users.student1._id,
      course: courses.appliedMathCourse._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_test_1001',
      gatewayPaymentId: 'pay_rzp_test_5001',
      amount: courses.appliedMathCourse.price,
      currency: 'INR',
      status: 'success' as const,
      receiptId: 'rcpt_math_student1_01',
      createdAt: daysAgo(12),
    },
    {
      student: users.student1._id,
      course: courses.mernCourse._id,
      gateway: 'stripe' as const,
      gatewayOrderId: 'order_strp_test_1002',
      gatewayPaymentId: 'pay_strp_test_5002',
      amount: courses.mernCourse.price,
      currency: 'INR',
      status: 'success' as const,
      receiptId: 'rcpt_mern_student1_02',
      createdAt: daysAgo(5),
    },
    {
      student: users.student2._id,
      course: courses.appliedMathCourse._id,
      gateway: 'stripe' as const,
      gatewayOrderId: 'order_strp_test_1003',
      gatewayPaymentId: 'pay_strp_test_5003',
      amount: courses.appliedMathCourse.price,
      currency: 'INR',
      status: 'success' as const,
      receiptId: 'rcpt_math_student2_03',
      createdAt: daysAgo(8),
    },
    {
      student: users.student3._id,
      course: courses.dataScienceCourse._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_test_1004',
      gatewayPaymentId: '',
      amount: courses.dataScienceCourse.price,
      currency: 'INR',
      status: 'pending' as const,
      receiptId: 'rcpt_ds_student3_04',
      createdAt: daysAgo(2),
    },
    {
      student: users.student4._id,
      course: courses.uiUxCourse._id,
      gateway: 'razorpay' as const,
      gatewayOrderId: 'order_rzp_test_1005',
      gatewayPaymentId: 'pay_rzp_failed_5005',
      amount: courses.uiUxCourse.price,
      currency: 'INR',
      status: 'failed' as const,
      receiptId: 'rcpt_uiux_student4_05',
      createdAt: daysAgo(1),
    },
  ];

  const resultMap: Record<string, IOrder> = {};

  for (const item of ordersData) {
    let order = await OrderModel.findOne({ receiptId: item.receiptId });
    if (!order) {
      order = await OrderModel.create(item);
      console.log(`  ✓ Created order: ${item.receiptId} (${item.status})`);
    } else {
      console.log(`  ℹ Order already exists: ${item.receiptId}`);
    }
    resultMap[item.receiptId] = order;
  }

  return {
    student1AppliedMathOrder: resultMap['rcpt_math_student1_01'],
    student1MernOrder: resultMap['rcpt_mern_student1_02'],
    student2AppliedMathOrder: resultMap['rcpt_math_student2_03'],
    student3DataScienceOrder: resultMap['rcpt_ds_student3_04'],
    student4UiUxOrder: resultMap['rcpt_uiux_student4_05'],
  };
}
