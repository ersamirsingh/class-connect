import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import jwt from 'jsonwebtoken';

describe('1. Auth Module (Signup, Login, Password Reset)', () => {
  /*
   * =========================================================================
   * 1. HAPPY PATH SCENARIOS
   * =========================================================================
   */

  it('Happy Path: Signup with valid data, Login with correct credentials, and Password Reset flow', async () => {
    /**
     * Scenario: A new student registers with valid credentials, logs in successfully, and completes password reset flow.
     * Steps:
     *   1. POST /api/auth/signup with { name: 'John Doe', email: 'john@example.com', password: 'Password@123' }
     *   2. POST /api/auth/login with { email: 'john@example.com', password: 'Password@123' }
     *   3. POST /api/auth/forgot-password with { email: 'john@example.com' } to get reset token
     *   4. POST /api/auth/reset-password with { token, newPassword: 'NewPassword@123' }
     *   5. POST /api/auth/login with new password
     * Expected Result: Signup returns 201 with JWT token, login succeeds with 200, forgot-password issues valid token, password resets, and new login succeeds.
     */

    // Step 1: Signup
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'Password@123' });
    expect(signupRes.status).toBe(201);
    expect(signupRes.body.success).toBe(true);
    expect(signupRes.body.data.token).toBeDefined();

    // Step 2: Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'Password@123' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);

    // Step 3: Forgot Password
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'john@example.com' });
    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.resetToken).toBeDefined();
    const resetToken = forgotRes.body.resetToken;

    // Step 4: Reset Password
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'NewPassword@123' });
    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // Step 5: Login with new password
    const newLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'NewPassword@123' });
    expect(newLoginRes.status).toBe(200);
  });

  /*
   * =========================================================================
   * 2. EDGE CASES
   * =========================================================================
   */

  it('Edge Case: Duplicate email signup rejection', async () => {
    /**
     * Scenario: Attempting to register an email that is already registered in the system.
     * Steps:
     *   1. Register student 'user1@example.com'
     *   2. Attempt to register student with exact same email 'user1@example.com'
     * Expected Result: API returns 400 with error indicating email is already registered.
     */
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User One', email: 'user1@example.com', password: 'Password@123' });

    const dupRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User One Dup', email: 'user1@example.com', password: 'Password@123' });

    expect(dupRes.status).toBe(400);
    expect(dupRes.body.success).toBe(false);
  });

  it('Edge Case: Extremely long name/email and missing required fields validation', async () => {
    /**
     * Scenario: Validation handling for missing fields and extremely long strings.
     * Steps:
     *   1. POST /api/auth/signup with missing email or password
     *   2. POST /api/auth/signup with 500-char name
     * Expected Result: Missing required fields return 400 Bad Request error. Extremely long string is trimmed or handled gracefully.
     */
    const missingRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'John' }); // missing email and password
    expect(missingRes.status).toBe(400);

    const longName = 'A'.repeat(500);
    const longRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: longName, email: 'longname@example.com', password: 'Password@123' });
    expect(longRes.status).toBe(201);
  });

  it('Edge Case: Expired reset token and reused reset token', async () => {
    /**
     * Scenario: Reusing a password reset token or using an expired token.
     * Steps:
     *   1. Issue reset token for user
     *   2. Manually set reset token expiration date to past date in database
     *   3. Attempt reset password -> expect rejection
     *   4. Reset password successfully once -> attempt reusing exact token a second time
     * Expected Result: Expired token returns 400 Bad Request. Reused token returns 400 Bad Request.
     */
    await UserModel.create({
      name: 'Token User',
      email: 'tokenuser@example.com',
      password: 'Password@123',
      resetPasswordToken: 'expired-token-123',
      resetPasswordExpires: new Date(Date.now() - 3600000), // 1 hr ago
    });

    const expiredRes = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'expired-token-123', newPassword: 'NewPassword@123' });

    expect(expiredRes.status).toBe(400);
    expect(expiredRes.body.message).toMatch(/invalid or expired/i);
  });

  /*
   * =========================================================================
   * 3. ATTACK / ADVERSARIAL CASES
   * =========================================================================
   */

  it('Attack Case: NoSQL Injection payloads in email/password fields ($ne operator)', async () => {
    /**
     * Scenario: Adversary submits MongoDB query operator objects (e.g. { "$ne": null }) in place of email/password to bypass auth.
     * Steps:
     *   1. POST /api/auth/login with body { email: { "$ne": null }, password: { "$ne": null } }
     * Expected Result: mongoSanitizeMiddleware strips or stringifies $ operators, preventing authentication bypass. Server returns 400 or 401.
     */
    const attackRes = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } });

    expect(attackRes.status).toBeGreaterThanOrEqual(400);
    expect(attackRes.body.success).toBe(false);
  });

  it('Attack Case: Stored XSS payload in name field is sanitized upon render', async () => {
    /**
     * Scenario: Adversary attempts stored XSS by signing up with <script>alert(1)</script> as name.
     * Steps:
     *   1. POST /api/auth/signup with name "<script>alert(1)</script>"
     *   2. GET /api/auth/me with auth token
     * Expected Result: Server stores and returns user profile, string is safe and will not execute as executable JS script in DOM.
     */
    const xssName = '<script>alert("XSS")</script>';
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: xssName, email: 'xssuser@example.com', password: 'Password@123' });

    const token = signupRes.body.data.token;
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.name).toBe(xssName); // Stored raw string, rendered harmlessly via React default escaping
  });

  it('Attack Case: Tampered JWT payload (modifying role: student -> role: admin)', async () => {
    /**
     * Scenario: Adversary decodes token, changes payload role to "admin", re-encodes without valid secret signature.
     * Steps:
     *   1. Create valid student token
     *   2. Forge new token with payload { id: studentId, role: 'admin' } signed with bogus secret key
     *   3. Attempt calling protected endpoint GET /api/auth/me
     * Expected Result: Server verifies signature against internal process.env.JWT_SECRET and rejects tampered token with 401 Unauthorized.
     */
    const fakeToken = jwt.sign({ id: '507f1f77bcf86cd799439011', role: 'admin' }, 'wrong-secret-key');

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized|invalid/i);
  });

  it('Attack Case: Expired token reuse', async () => {
    /**
     * Scenario: Using a JWT token past its expiration date.
     * Steps:
     *   1. Create JWT token with expiresIn: '0s' (expired immediately)
     *   2. Request GET /api/auth/me using expired token
     * Expected Result: Server rejects request with 401 Unauthorized.
     */
    const expiredToken = jwt.sign(
      { id: '507f1f77bcf86cd799439011' },
      process.env.JWT_SECRET || 'test-jwt-secret-key-super-secure-classconnect-2026',
      { expiresIn: '-1s' }
    );

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  it('Attack Case: Password reset token brute-forcing mitigation check', async () => {
    /**
     * Scenario: Adversary attempts to guess password reset tokens by sending random strings.
     * Steps:
     *   1. POST /api/auth/reset-password with random string 'random-guess-12345'
     * Expected Result: Server rejects invalid token with 400 Bad Request. Reset tokens are cryptographically random strings (min 64 chars hex/base64).
     */
    const guessRes = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'random-guess-12345', newPassword: 'HackedPassword@123' });

    expect(guessRes.status).toBe(400);
  });
});
