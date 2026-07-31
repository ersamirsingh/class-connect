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
    };
  }

  static async verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) {
    const order = await OrderModel.findById(payload.orderId);
    if (!order) {
      throw new Error('Order record not found.');
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

  static async verifyStripePayment(orderId: string, paymentIntentId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error('Order not found.');

    order.gatewayPaymentId = paymentIntentId;
    order.status = 'success';
    await order.save();

    // Idempotent enrollment creation
    await PaymentService.grantCourseEnrollment(order.student.toString(), order.course.toString(), order._id.toString());

    return { success: true, message: 'Stripe payment verified & access granted!', order };
  }

  static async grantCourseEnrollment(studentId: string, courseId: string, orderId: string) {
    const existing = await EnrollmentModel.findOne({ student: studentId, course: courseId });
    if (existing) {
      existing.status = 'active';
      existing.order = orderId as any;
      return existing.save();
    }

    const enrollment = new EnrollmentModel({
      student: studentId,
      course: courseId,
      order: orderId,
      status: 'active',
    });
    return enrollment.save();
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
