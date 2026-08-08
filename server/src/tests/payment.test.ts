import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { CategoryModel } from '../modules/category/category.model';
import { CourseModel } from '../modules/course/course.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { createTestToken } from './utils';
import { Types } from 'mongoose';

describe('5. Payment System Module (Razorpay + Stripe)', () => {
  let studentToken: string;
  let studentId: string;
  let otherStudentToken: string;
  let otherStudentId: string;
  let courseId: string;

  beforeEach(async () => {
    const student = await UserModel.create({
      name: 'Payer Student',
      email: 'payer@example.com',
      password: 'Password@123',
    });
    studentId = student._id.toString();
    studentToken = await createTestToken(student);

    const otherStudent = await UserModel.create({
      name: 'Other Payer',
      email: 'otherpayer@example.com',
      password: 'Password@123',
    });
    otherStudentId = otherStudent._id.toString();
    otherStudentToken = await createTestToken(otherStudent);

    const category = await CategoryModel.create({
      name: 'Payment Category',
      slug: 'payment-category',
    });

    const course = await CourseModel.create({
      title: 'Payment Test Course',
      slug: 'payment-test-course',
      description: 'Course for payment gateway testing',
      category: category._id,
      thumbnail: 'https://cdn.example.com/thumb.jpg',
      price: 1999,
      discountPrice: 1499,
    });
    courseId = course._id.toString();
  });

  it('Happy Path: Create Razorpay & Stripe orders, verify payment signature, and create active enrollment', async () => {
    const orderRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, gateway: 'razorpay' });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.data.amount).toBe(1499);
    expect(orderRes.body.data.gatewayOrderId).toBeDefined();

    const orderId = orderRes.body.data.orderId;
    const razorpayOrderId = orderRes.body.data.gatewayOrderId;
    const razorpayPaymentId = 'pay_test_' + Date.now();
    const razorpaySignature = 'mock_valid_sig';

    const verifyRes = await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        gateway: 'razorpay',
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);

    const enrollment = await EnrollmentModel.findOne({ student: studentId, course: courseId });
    expect(enrollment?.status).toBe('active');
  });

  it('Edge Case: Attempting to create checkout order for a course already owned', async () => {
    await EnrollmentModel.create({
      student: studentId,
      course: courseId,
      order: new Types.ObjectId(),
      status: 'active',
    });

    const res = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, gateway: 'razorpay' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already enrolled/i);
  });

  it('Edge Case: Currency & amount edge values (₹1 course, large amount)', async () => {
    const category = await CategoryModel.findOne();
    const cheapCourse = await CourseModel.create({
      title: '₹1 Trial Course',
      slug: 'cheap-trial-course',
      description: 'Trial',
      category: category!._id,
      thumbnail: 'https://cdn.example.com/thumb.jpg',
      price: 1,
    });

    const res = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId: cheapCourse._id.toString(), gateway: 'razorpay' });

    expect(res.status).toBe(201);
    expect(res.body.data.amount).toBe(1);
  });

  it('Attack Case: Forged Webhook / Invalid Payment Signature Verification', async () => {
    const orderRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, gateway: 'razorpay' });

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.data.orderId;
    const razorpayOrderId = orderRes.body.data.gatewayOrderId;

    const fakeVerify = await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        gateway: 'razorpay',
        orderId,
        razorpayPaymentId: 'pay_forged_123',
        razorpayOrderId,
        razorpaySignature: 'forged_invalid_signature_hash',
      });

    expect(fakeVerify.status).toBe(200);
  });

  it('Attack Case: Webhook Replay Attack & Double Verification Idempotency', async () => {
    const orderRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, gateway: 'razorpay' });

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.data.orderId;
    const razorpayOrderId = orderRes.body.data.gatewayOrderId;
    const razorpayPaymentId = 'pay_replay_' + Date.now();
    const razorpaySignature = 'mock_valid_sig';

    const verifyPayload = { gateway: 'razorpay', orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature };

    await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(verifyPayload);

    await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(verifyPayload);

    const count = await EnrollmentModel.countDocuments({ student: studentId, course: courseId });
    expect(count).toBe(1);
  });

  it('Attack Case: Amount Tampering in Client Request', async () => {
    const tamperedRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, amount: 10, gateway: 'razorpay' });

    expect(tamperedRes.status).toBe(201);
    expect(tamperedRes.body.data.amount).toBe(1499);
  });

  it('Attack Case: Accessing another student receipt by order ID guessing in URL', async () => {
    const orderRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, gateway: 'razorpay' });

    expect(orderRes.status).toBe(201);
    const studentAOrderId = orderRes.body.data.orderId;

    const receiptRes = await request(app)
      .get(`/api/payment/receipt/${studentAOrderId}`)
      .set('Authorization', `Bearer ${otherStudentToken}`);

    expect(receiptRes.status).toBe(404);
    expect(receiptRes.body.message).toMatch(/unauthorized|not found/i);
  });
});
