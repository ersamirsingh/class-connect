import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { DocumentVerificationModel } from '../modules/verification/documentVerification.model';
import { createTestToken } from './utils';

describe('10. Document Verification Module', () => {
  let student1Token: string;
  let student1Id: string;
  let student2Token: string;
  let student2Id: string;
  let adminToken: string;

  beforeEach(async () => {
    const student1 = await UserModel.create({
      name: 'Student One',
      email: 'student1@example.com',
      password: 'Password@123',
    });
    student1Id = student1._id.toString();
    student1Token = await createTestToken(student1);

    const student2 = await UserModel.create({
      name: 'Student Two',
      email: 'student2@example.com',
      password: 'Password@123',
    });
    student2Id = student2._id.toString();
    student2Token = await createTestToken(student2);

    const admin = await UserModel.create({
      name: 'Admin Verifier',
      email: 'adminverifier@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminToken = await createTestToken(admin);
  });

  it('Happy Path: Student submits mandatory Aadhaar document (PAN optional), Admin approves verification', async () => {
    const submitRes = await request(app)
      .post('/api/verification/submit')
      .set('Authorization', `Bearer ${student1Token}`)
      .send({
        aadhaarNumber: '123456789012',
        aadhaarImageUrl: 'https://cloudinary.com/aadhaar1.jpg',
      });

    expect(submitRes.status).toBe(200);
    const docId = submitRes.body.data._id;

    const reviewRes = await request(app)
      .post(`/api/verification/admin/review/${docId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'approve' });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.data.status).toBe('verified');
  });

  it('Validation Case: Rejects submission missing mandatory Aadhaar details', async () => {
    const submitRes = await request(app)
      .post('/api/verification/submit')
      .set('Authorization', `Bearer ${student1Token}`)
      .send({
        panNumber: 'ABCDE1234F',
        panImageUrl: 'https://cloudinary.com/pan1.jpg',
      });

    expect(submitRes.status).toBe(400);
    expect(submitRes.body.message).toContain('Aadhaar number and Aadhaar card document image are required');
  });

  it('Attack Case: Duplicate Submission across two different student accounts flagged for admin review', async () => {
    const submit1 = await request(app)
      .post('/api/verification/submit')
      .set('Authorization', `Bearer ${student1Token}`)
      .send({
        aadhaarNumber: '123456789012',
        aadhaarImageUrl: 'https://cloudinary.com/aadhaar1.jpg',
      });
    expect(submit1.status).toBe(200);

    const submit2 = await request(app)
      .post('/api/verification/submit')
      .set('Authorization', `Bearer ${student2Token}`)
      .send({
        aadhaarNumber: '123456789012',
        aadhaarImageUrl: 'https://cloudinary.com/aadhaar2.jpg',
      });

    expect(submit2.status).toBe(200);

    // Verify Admin queue catches submissions
    const queueRes = await request(app)
      .get('/api/verification/admin/queue')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(queueRes.status).toBe(200);
    expect(queueRes.body.data.length).toBe(2);
  });

  it('Attack Case: Student attempting to self-approve verification by calling admin endpoint directly', async () => {
    const doc = await DocumentVerificationModel.create({
      student: student1Id,
      aadhaarNumber: '987654321098',
      aadhaarImageUrl: 'https://cloudinary.com/aadhaar.jpg',
      status: 'pending',
    });

    const selfApproveRes = await request(app)
      .post(`/api/verification/admin/review/${doc._id}`)
      .set('Authorization', `Bearer ${student1Token}`)
      .send({ action: 'approve' });

    expect(selfApproveRes.status).toBe(403);

    const docDb = await DocumentVerificationModel.findById(doc._id);
    expect(docDb?.status).toBe('pending');
  });
});
