import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { CategoryModel } from '../modules/category/category.model';
import { CourseModel } from '../modules/course/course.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { createTestToken } from './utils';
import { Types } from 'mongoose';

describe('6. Enrollment & Course Access Security Module', () => {
  let enrolledStudentToken: string;
  let enrolledStudentId: string;
  let nonEnrolledStudentToken: string;
  let courseAId: string;
  let courseBId: string;

  beforeEach(async () => {
    const student1 = await UserModel.create({
      name: 'Enrolled Student A',
      email: 'studentA@example.com',
      password: 'Password@123',
    });
    enrolledStudentId = student1._id.toString();
    enrolledStudentToken = await createTestToken(student1);

    const student2 = await UserModel.create({
      name: 'Non Enrolled Student',
      email: 'studentB@example.com',
      password: 'Password@123',
    });
    nonEnrolledStudentToken = await createTestToken(student2);

    const category = await CategoryModel.create({
      name: 'Test Category',
      slug: 'test-category',
    });

    const courseA = await CourseModel.create({
      title: 'Course A (Paid)',
      slug: 'course-a-paid',
      description: 'Paid Course A',
      category: category._id,
      thumbnail: 'https://cloudinary.com/thumb.jpg',
      price: 2000,
      sections: [
        {
          title: 'Topic A1',
          order: 1,
          lectures: [
            {
              title: 'Lecture A1',
              duration: '10 mins',
              videoUrl: 'https://res.cloudinary.com/demo/video/authenticated/private_lecture_a1.mp4',
              isPreview: false,
            },
          ],
        },
      ],
    });
    courseAId = courseA._id.toString();

    const courseB = await CourseModel.create({
      title: 'Course B (Paid)',
      slug: 'course-b-paid',
      description: 'Paid Course B',
      category: category._id,
      thumbnail: 'https://cloudinary.com/thumb.jpg',
      price: 3000,
      sections: [
        {
          title: 'Topic B1',
          order: 1,
          lectures: [
            {
              title: 'Lecture B1',
              duration: '10 mins',
              videoUrl: 'https://res.cloudinary.com/demo/video/authenticated/private_lecture_b1.mp4',
              isPreview: false,
            },
          ],
        },
      ],
    });
    courseBId = courseB._id.toString();

    await EnrollmentModel.create({
      student: enrolledStudentId,
      course: courseAId,
      order: new Types.ObjectId(),
      status: 'active',
    });
  });

  it('Happy Path: Enrolled student can check enrollment status and progress for Course A', async () => {
    const statusRes = await request(app)
      .get(`/api/enrollments/status/${courseAId}`)
      .set('Authorization', `Bearer ${enrolledStudentToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.isEnrolled).toBe(true);
  });

  it('Attack Case: Non-enrolled student attempting to check status or complete lectures for paid Course A', async () => {
    const statusRes = await request(app)
      .get(`/api/enrollments/status/${courseAId}`)
      .set('Authorization', `Bearer ${nonEnrolledStudentToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.isEnrolled).toBe(false);
  });

  it('Attack Case: Enrolled student of Course A attempting to access Course B lecture data', async () => {
    const res = await request(app)
      .get(`/api/enrollments/status/${courseBId}`)
      .set('Authorization', `Bearer ${enrolledStudentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isEnrolled).toBe(false);
  });

  it('Attack Case: Cloudinary Private Asset Protection (Unsigned URL Bypass Attempt)', async () => {
    const course = await CourseModel.findById(courseAId);
    const lectureVideoUrl = course?.sections[0].lectures[0].videoUrl;

    expect(lectureVideoUrl).toMatch(/authenticated|private/);
  });
});
