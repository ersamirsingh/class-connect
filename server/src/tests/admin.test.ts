import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { createTestToken } from './utils';

describe('3. Admin Management Module (Create/Remove Admin)', () => {
  let adminToken: string;
  let adminId: string;
  let studentToken: string;

  beforeEach(async () => {
    const admin = await UserModel.create({
      name: 'Primary Admin',
      email: 'admin1@example.com',
      password: 'Password@123',
      role: 'admin',
      isActive: true,
    });
    adminId = admin._id.toString();
    adminToken = await createTestToken(admin);

    const student = await UserModel.create({
      name: 'Regular Student',
      email: 'student@example.com',
      password: 'Password@123',
      role: 'student',
    });
    studentToken = await createTestToken(student);
  });

  it('Happy Path: Existing admin creates a new admin and deactivates an admin when multiple exist', async () => {
    const createRes = await request(app)
      .post('/api/admin/admins')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Second Admin', email: 'admin2@example.com', password: 'Admin@123456' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.role).toBe('admin');
    const secondAdminId = createRes.body.data._id;

    const toggleRes = await request(app)
      .put(`/api/admin/users/${secondAdminId}/toggle-status`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.data.isActive).toBe(false);
  });

  it('Attack Case: Deactivating the LAST remaining active admin account', async () => {
    const toggleRes = await request(app)
      .put(`/api/admin/users/${adminId}/toggle-status`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(toggleRes.status).toBe(400);
    expect(toggleRes.body.message).toMatch(/last remaining active admin/i);

    const adminDb = await UserModel.findById(adminId);
    expect(adminDb?.isActive).toBe(true);
  });

  it('Attack Case: Non-admin attempting to call create-admin or deactivate-admin endpoints directly', async () => {
    const createRes = await request(app)
      .post('/api/admin/admins')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Hacked Admin', email: 'hackedadmin@example.com', password: 'Admin@123456' });

    expect(createRes.status).toBe(403);

    const toggleRes = await request(app)
      .put(`/api/admin/users/${adminId}/toggle-status`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(toggleRes.status).toBe(403);
  });

  it('Attack Case: Attempting to call non-existent public seed-admin endpoint', async () => {
    const seedRes = await request(app)
      .post('/api/admin/seed')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(seedRes.status).toBe(404);
  });
});
