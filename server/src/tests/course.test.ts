import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { CategoryModel } from '../modules/category/category.model';
import { CourseModel } from '../modules/course/course.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { createTestToken } from './utils';
import { Types } from 'mongoose';

describe('4. Category & Course Management Module', () => {
  let adminToken: string;
  let studentToken: string;
  let categoryId: string;
  let courseId: string;

  beforeEach(async () => {
    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminToken = await createTestToken(admin);

    const student = await UserModel.create({
      name: 'Student User',
      email: 'student@example.com',
      password: 'Password@123',
      role: 'student',
    });
    studentToken = await createTestToken(student);

    const category = await CategoryModel.create({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Learn modern web dev',
    });
    categoryId = category._id.toString();
  });

  it('Happy Path: Admin creates category and course, updates course details, and deletes course', async () => {
    const coursePayload = {
      title: 'Fullstack React & Node.js',
      description: 'Master MERN stack development',
      category: categoryId,
      thumbnail: 'https://cloudinary.com/thumb.jpg',
      price: 2999,
      discountPrice: 1999,
      sections: [
        {
          title: 'Introduction',
          order: 1,
          lectures: [
            {
              title: 'Welcome',
              videoUrl: 'https://cloudinary.com/video1.mp4',
              duration: '5 mins',
              isPreview: true,
            },
          ],
        },
      ],
    };

    const createRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(coursePayload);

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.title).toBe('Fullstack React & Node.js');
    courseId = createRes.body.data._id;

    const editRes = await request(app)
      .put(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...coursePayload, price: 3499 });

    expect(editRes.status).toBe(200);
    expect(editRes.body.data.price).toBe(3499);

    const deleteRes = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
  });

  it('Edge Case: Archiving/Unpublishing a course that has active student enrollments retains student access', async () => {
    const course = await CourseModel.create({
      title: 'Active Enrolled Course',
      slug: 'active-enrolled-course',
      description: 'Test description',
      category: categoryId,
      thumbnail: 'https://cloudinary.com/thumb.jpg',
      price: 999,
      isPublished: true,
    });

    const student = await UserModel.findOne({ role: 'student' });
    await EnrollmentModel.create({
      student: student!._id,
      course: course._id,
      order: new Types.ObjectId(),
      status: 'active',
    });

    await request(app)
      .put(`/api/courses/${course._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isPublished: false });

    const statusRes = await request(app)
      .get(`/api/enrollments/status/${course._id}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.isEnrolled).toBe(true);
  });

  it('Edge Case: Extremely long course title and multi-paragraph description', async () => {
    const longTitle = 'T'.repeat(1000);
    const longDesc = 'D'.repeat(5000);

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: longTitle,
        description: longDesc,
        category: categoryId,
        thumbnail: 'https://cloudinary.com/thumb.jpg',
        price: 999,
      });

    expect(res.status).toBe(201);
  });

  it('Attack Case: XSS payloads in course title/description/Topic names', async () => {
    const xssTitle = '<svg onload=alert(1)>';
    const xssDesc = '<iframe src=javascript:alert(1)>';

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: xssTitle,
        description: xssDesc,
        category: categoryId,
        thumbnail: 'https://cloudinary.com/thumb.jpg',
        price: 499,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe(xssTitle);
  });

  it('Attack Case: File upload validation for lecture videos (non-video file extension bypass attempt)', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('echo "malicious script"'), {
        filename: 'virus.mp4',
        contentType: 'text/plain',
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
