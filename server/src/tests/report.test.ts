import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { ReportModel } from '../modules/report/report.model';
import { createTestToken } from './utils';

describe('8. Report a Problem Module', () => {
  let studentToken: string;
  let studentId: string;
  let otherStudentToken: string;
  let adminToken: string;

  beforeEach(async () => {
    const student = await UserModel.create({
      name: 'Reporter Student',
      email: 'reporter@example.com',
      password: 'Password@123',
    });
    studentId = student._id.toString();
    studentToken = await createTestToken(student);

    const otherStudent = await UserModel.create({
      name: 'Other Student',
      email: 'otherstudent@example.com',
      password: 'Password@123',
    });
    otherStudentToken = await createTestToken(otherStudent);

    const admin = await UserModel.create({
      name: 'Admin Moderator',
      email: 'adminmod@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminToken = await createTestToken(admin);
  });

  it('Happy Path: Student submits problem report with description, Admin reviews and updates status to resolved', async () => {
    const reportRes = await request(app)
      .post('/api/report')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        category: 'video',
        description: 'Video buffers endlessly at 02:15 timestamp',
      });

    expect(reportRes.status).toBe(201);
    const reportId = reportRes.body.data._id;

    const updateRes = await request(app)
      .put(`/api/report/${reportId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'resolved' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('resolved');
  });

  it('Attack Case: Uploading executable file disguised as JPEG image (.jpg)', async () => {
    const res = await request(app)
      .post('/api/report')
      .set('Authorization', `Bearer ${studentToken}`)
      .field('category', 'other')
      .field('description', 'Testing upload')
      .attach('attachments', Buffer.from('#!/bin/bash\necho hacked'), {
        filename: 'malicious.jpg',
        contentType: 'text/x-shellscript',
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('Attack Case: Stored XSS payload in problem description field', async () => {
    const xssText = '<img src=x onerror=alert("hack")>';
    const res = await request(app)
      .post('/api/report')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        category: 'other',
        description: xssText,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.description).toBe(xssText);
  });

  it('Attack Case: Student attempting to view or resolve another student report', async () => {
    const report = await ReportModel.create({
      student: studentId,
      category: 'payment',
      description: 'Payment issue',
    });

    const hijackRes = await request(app)
      .put(`/api/report/${report._id}/status`)
      .set('Authorization', `Bearer ${otherStudentToken}`)
      .send({ status: 'resolved' });

    expect(hijackRes.status).toBe(403);
  });
});
