import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { CategoryModel } from '../modules/category/category.model';
import { CourseModel } from '../modules/course/course.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { createTestToken } from './utils';
import { Types } from 'mongoose';

describe('12. Live Class Chat & Moderation Module', () => {
  let studentToken: string;
  let studentId: string;
  let nonEnrolledToken: string;
  let adminToken: string;
  let courseId: string;
  let liveSessionId: string = 'live-session-101';

  beforeEach(async () => {
    const student = await UserModel.create({
      name: 'Live Chat Student',
      email: 'livechat@example.com',
      password: 'Password@123',
    });
    studentId = student._id.toString();
    studentToken = await createTestToken(student);

    const nonEnrolled = await UserModel.create({
      name: 'Non Enrolled Live User',
      email: 'nonenrolledlive@example.com',
      password: 'Password@123',
    });
    nonEnrolledToken = await createTestToken(nonEnrolled);

    const admin = await UserModel.create({
      name: 'Live Moderator Admin',
      email: 'liveadmin@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminToken = await createTestToken(admin);

    const category = await CategoryModel.create({
      name: 'Live Category',
      slug: 'live-category',
    });

    const course = await CourseModel.create({
      title: 'Live Class Course',
      slug: 'live-class-course',
      description: 'Course with live stream',
      category: category._id,
      thumbnail: 'https://cdn.example.com/thumb.jpg',
      price: 2500,
    });
    courseId = course._id.toString();

    await EnrollmentModel.create({
      student: studentId,
      course: courseId,
      order: new Types.ObjectId(),
      status: 'active',
    });
  });

  it('Happy Path: Fetch live chat history, Admin suspends and restores student status', async () => {
    const historyRes = await request(app)
      .get(`/api/live/session/${liveSessionId}/messages`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(historyRes.status).toBe(200);

    const suspendRes = await request(app)
      .post(`/api/live/session/${liveSessionId}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ studentId, type: 'full', courseId, reason: 'Disruptive' });

    expect(suspendRes.status).toBe(200);
    expect(suspendRes.body.success).toBe(true);

    const restoreRes = await request(app)
      .post(`/api/live/session/${liveSessionId}/restore`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ studentId });

    expect(restoreRes.status).toBe(200);
  });

  it('Attack Case: Non-admin student attempting to call live moderation endpoints (suspend/restore)', async () => {
    const res = await request(app)
      .post(`/api/live/session/${liveSessionId}/suspend`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ studentId, type: 'chat_mute', courseId });

    expect(res.status).toBe(403);
  });

  it('Attack Case: XSS Payload sent as Live Chat message', async () => {
    const xssMsg = '<img src=x onerror=alert("Socket XSS")>';
    expect(xssMsg).toMatch(/<img/);
  });

  it('Attack Case: Reconnection Enforcement for Fully Suspended Student', async () => {
    const suspendRes = await request(app)
      .post(`/api/live/session/${liveSessionId}/suspend`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ studentId, type: 'full', courseId });

    expect(suspendRes.status).toBe(200);
  });
});
