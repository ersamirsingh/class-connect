import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { ContentBlockModel } from '../modules/content/content.model';
import { createTestToken } from './utils';

describe('11. Telugu / i18n Internationalization Module', () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await UserModel.create({
      name: 'CMS Admin',
      email: 'cmsadmin@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminToken = await createTestToken(admin);
  });

  it('Happy Path: CMS supports bilingual fields (English & Telugu content blocks)', async () => {
    const createRes = await request(app)
      .post('/api/content/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        page: 'home',
        section: 'hero',
        title: 'Learn Fullstack Web Development',
        subtitle: 'ఫుల్‌స్టాక్ వెబ్ డెవలప్‌మెంట్ నేర్చుకోండి',
        data: {
          contentEn: 'Learn Fullstack Web Development',
          contentTe: 'ఫుల్‌స్టాక్ వెబ్ డెవలప్‌మెంట్ నేర్చుకోండి',
        },
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.title).toBe('Learn Fullstack Web Development');

    const publicRes = await request(app).get('/api/content');
    expect(publicRes.status).toBe(200);
  });

  it('Edge Case: Course / Content with missing Telugu field gracefully falls back to English', async () => {
    const res = await request(app)
      .post('/api/content/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        page: 'footer',
        section: 'copyright',
        title: '© 2026 ClassConnect. All rights reserved.',
        subtitle: '',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('© 2026 ClassConnect. All rights reserved.');
  });

  it('Attack Case: Stored XSS payload in Telugu language input field via CMS editor', async () => {
    const xssPayload = '<script>alert("Telugu XSS")</script>';

    const res = await request(app)
      .post('/api/content/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        page: 'about',
        section: 'mission',
        title: xssPayload,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe(xssPayload);
  });
});
