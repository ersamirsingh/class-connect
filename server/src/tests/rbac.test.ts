import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { createTestToken } from './utils';

describe('2. Role-Based Access Control (RBAC) Module', () => {
  let studentToken: string;
  let studentId: string;
  let adminToken: string;
  let adminId: string;
  let otherStudentToken: string;
  let otherStudentId: string;

  beforeEach(async () => {
    const student = await UserModel.create({
      name: 'Student User',
      email: 'student@example.com',
      password: 'Password@123',
      role: 'student',
    });
    studentId = student._id.toString();
    studentToken = await createTestToken(student);

    const otherStudent = await UserModel.create({
      name: 'Other Student',
      email: 'otherstudent@example.com',
      password: 'Password@123',
      role: 'student',
    });
    otherStudentId = otherStudent._id.toString();
    otherStudentToken = await createTestToken(otherStudent);

    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminId = admin._id.toString();
    adminToken = await createTestToken(admin);
  });

  it('Happy Path: Student accesses student-permitted routes & Admin accesses admin routes', async () => {
    const studentRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(studentRes.status).toBe(200);

    const adminRes = await request(app)
      .get('/api/admin/admins')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminRes.status).toBe(200);
  });

  it('Attack Case: Student directly calling an admin-only API (POST /api/courses)', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Hacked Course',
        description: 'Unauthorized creation',
        category: '507f1f77bcf86cd799439011',
        price: 100,
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Forbidden|permission/i);
  });

  it('Attack Case: Privilege Escalation via Mass Assignment (role: admin in profile update body)', async () => {
    const updateRes = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ role: 'admin', phone: '9876543210' });

    expect(updateRes.status).toBe(200);

    const dbUser = await UserModel.findById(studentId);
    expect(dbUser?.role).toBe('student');
  });

  it('Attack Case: BOLA / IDOR - Accessing or mutating another student profile by ID manipulation', async () => {
    const updateRes = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ id: otherStudentId, name: 'Hacked Name' });

    expect(updateRes.status).toBe(200);

    const otherUser = await UserModel.findById(otherStudentId);
    expect(otherUser?.name).toBe('Other Student');

    const studentAUser = await UserModel.findById(studentId);
    expect(studentAUser?.name).toBe('Hacked Name');
  });
});
