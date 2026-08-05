import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { CategoryModel } from '../modules/category/category.model';
import { CourseModel } from '../modules/course/course.model';
import { createTestToken } from './utils';

describe('7. Preview Video View Limit Module', () => {
  let studentToken: string;
  let studentId: string;
  let courseId: string;

  beforeEach(async () => {
    const student = await UserModel.create({
      name: 'Preview Student',
      email: 'previewstudent@example.com',
      password: 'Password@123',
      previewViews: [],
    });
    studentId = student._id.toString();
    studentToken = await createTestToken(student);

    const category = await CategoryModel.create({
      name: 'Preview Category',
      slug: 'preview-category',
    });

    const course = await CourseModel.create({
      title: 'Preview Test Course',
      slug: 'preview-test-course',
      description: 'Course with preview limit',
      category: category._id,
      thumbnail: 'https://cloudinary.com/thumb.jpg',
      price: 1500,
      maxPreviewViews: 3,
    });
    courseId = course._id.toString();
  });

  it('Happy Path: Logged-in student tracks preview plays up to limit N', async () => {
    for (let i = 1; i <= 3; i++) {
      const res = await request(app)
        .post(`/api/courses/${courseId}/preview/play`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.allowed).toBe(true);
    }

    const blockedRes = await request(app)
      .post(`/api/courses/${courseId}/preview/play`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(blockedRes.status).toBe(400);
    expect(blockedRes.body.message).toMatch(/limit reached|purchase/i);
  });

  it('Attack Case: Incognito / Cookie clearing bypass attempt for logged-in user', async () => {
    await UserModel.findByIdAndUpdate(studentId, {
      $set: { previewViews: [{ course: courseId, count: 3 }] },
    });

    const res = await request(app)
      .post(`/api/courses/${courseId}/preview/play`)
      .set('Authorization', `Bearer ${studentToken}`)
      .set('User-Agent', 'Mozilla/5.0 Incognito Browser')
      .set('X-Forwarded-For', '198.51.100.44');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/limit reached|purchase/i);
  });

  it('Attack Case: Rapid Fire Play Limit Enforcement', async () => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post(`/api/courses/${courseId}/preview/play`)
        .set('Authorization', `Bearer ${studentToken}`);
      results.push(res);
    }

    const allowedCount = results.filter((r) => r.status === 200 && r.body.data?.allowed === true).length;
    const blockedCount = results.filter((r) => r.status === 400).length;

    expect(allowedCount).toBe(3);
    expect(blockedCount).toBe(2);
  });
});
