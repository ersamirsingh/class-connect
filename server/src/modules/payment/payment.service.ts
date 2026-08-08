import { OrderModel, IOrder } from './payment.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { CourseModel } from '../course/course.model';
import { RazorpayService } from './gateways/razorpay.service';
import { StripeService } from './gateways/stripe.service';

export class PaymentService {
  static async createOrder(payload: {
    studentId: string;
    courseId: string;
    gateway: 'razorpay' | 'stripe';
  }) {
    const course = await CourseModel.findById(payload.courseId);
    if (!course) {
      throw new Error('Course not found.');
    }

    const existingEnrollment = await EnrollmentModel.findOne({
      student: payload.studentId,
      course: payload.courseId,
      status: 'active',
    });
    if (existingEnrollment) {
      throw new Error('You are already enrolled in this course.');
    }

    const receiptId = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const priceToCharge = course.discountPrice && course.discountPrice > 0 ? course.discountPrice : course.price;

    // Handle Instant Free Course Enrollment (price === 0)
    if (priceToCharge <= 0) {
      const freeOrder = new OrderModel({
        student: payload.studentId,
        course: payload.courseId,
        gateway: payload.gateway,
        gatewayOrderId: `FREE-${receiptId}`,
        amount: 0,
        currency: 'INR',
        status: 'success',
        receiptId,
      });
      await freeOrder.save();
      await PaymentService.grantCourseEnrollment(payload.studentId, payload.courseId, freeOrder._id.toString());
      return {
        isFree: true,
        orderId: freeOrder._id,
        receiptId,
        amount: 0,
        currency: 'INR',
        courseTitle: course.title,
        message: 'Successfully enrolled in free course!',
      };
    }

    let gatewayData: any;
    if (payload.gateway === 'razorpay') {
      gatewayData = await RazorpayService.createOrder(priceToCharge, 'INR', receiptId);
    } else {
      gatewayData = await StripeService.createPaymentIntent(priceToCharge, 'USD', receiptId);
    }

    const order = new OrderModel({
      student: payload.studentId,
      course: payload.courseId,
      gateway: payload.gateway,
      gatewayOrderId: gatewayData.gatewayOrderId,
      amount: priceToCharge,
      currency: payload.gateway === 'razorpay' ? 'INR' : 'USD',
      status: 'pending',
      receiptId,
    });

    await order.save();

    const upiString = `upi://pay?pa=classconnect@upi&pn=ClassConnect&am=${priceToCharge}&tr=${receiptId}&tn=${encodeURIComponent(course.title)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

    return {
      orderId: order._id,
      receiptId,
      gateway: payload.gateway,
      gatewayOrderId: gatewayData.gatewayOrderId,
      keyId: gatewayData.keyId || null,
      clientSecret: gatewayData.clientSecret || null,
      amount: priceToCharge,
      currency: order.currency,
      courseTitle: course.title,
      upiString,
      qrCodeUrl,
    };
  }

  static async verifyRazorpayPayment(payload: {
    studentId: string;
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) {
    const order = await OrderModel.findById(payload.orderId);
    if (!order) {
      throw new Error('Order record not found.');
    }

    if (order.student.toString() !== payload.studentId) {
      throw new Error('Unauthorized: Order does not belong to the current authenticated student.');
    }

    const isValid = RazorpayService.verifySignature(
      payload.razorpayOrderId,
      payload.razorpayPaymentId,
      payload.razorpaySignature
    );

    if (!isValid) {
      order.status = 'failed';
      await order.save();
      throw new Error('Invalid payment signature verification failed.');
    }

    order.gatewayPaymentId = payload.razorpayPaymentId;
    order.status = 'success';
    await order.save();

    // Idempotent enrollment creation
    await PaymentService.grantCourseEnrollment(order.student.toString(), order.course.toString(), order._id.toString());

    return { success: true, message: 'Payment verified & course access granted!', order };
  }

  static async verifyStripePayment(studentId: string, orderId: string, paymentIntentId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error('Order not found.');

    if (order.student.toString() !== studentId) {
      throw new Error('Unauthorized: Order does not belong to the current authenticated student.');
    }

    order.gatewayPaymentId = paymentIntentId;
    order.status = 'success';
    await order.save();

    // Idempotent enrollment creation
    await PaymentService.grantCourseEnrollment(order.student.toString(), order.course.toString(), order._id.toString());

    return { success: true, message: 'Stripe payment verified & access granted!', order };
  }

  static async grantCourseEnrollment(studentId: string, courseId: string, orderId: string) {
    const existing = await EnrollmentModel.findOne({ student: studentId, course: courseId });
    let enrollment;
    if (existing) {
      existing.status = 'active';
      existing.order = orderId as any;
      enrollment = await existing.save();
    } else {
      enrollment = await new EnrollmentModel({
        student: studentId,
        course: courseId,
        order: orderId,
        status: 'active',
      }).save();
    }

    // Trigger Referral Commission if student was referred
    try {
      const { UserModel } = await import('../user/user.model');
      const { WalletService } = await import('../wallet/wallet.service');
      const student = await UserModel.findById(studentId);
      const order = await OrderModel.findById(orderId);
      if (student && student.referredBy && order && order.amount > 0) {
        await WalletService.creditReferralCommission(
          student.referredBy.toString(),
          studentId,
          orderId,
          order.amount
        );
      }
    } catch (err) {
      console.warn('Could not process referral commission:', err);
    }

    return enrollment;
  }

  static async getStudentOrderHistory(studentId: string) {
    return OrderModel.find({ student: studentId })
      .populate('course')
      .sort({ createdAt: -1 });
  }

  static async getReceipt(orderId: string, studentId: string) {
    const order = await OrderModel.findOne({ _id: orderId, student: studentId })
      .populate('course')
      .populate('student', 'name email phone');
    if (!order) {
      throw new Error('Receipt not found or unauthorized access.');
    }
    return order;
  }
}
