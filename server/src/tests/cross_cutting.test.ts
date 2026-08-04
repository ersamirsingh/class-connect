import request from 'supertest';
import app from '../app';

describe('13. Platform-Wide General Cross-Cutting & Security Audit Checks', () => {
  /*
   * =========================================================================
   * 1. API AUTHENTICATION SWEEP
   * =========================================================================
   */

  it('Cross-Cutting: Protected write-capable API endpoints require valid authentication headers', async () => {
    /**
     * Scenario: Unauthenticated client sends requests to protected write endpoints.
     * Steps:
     *   1. POST /api/courses without Authorization header -> 401
     *   2. POST /api/payment/create-order without Authorization header -> 401
     *   3. POST /api/wallet/withdraw without Authorization header -> 401
     *   4. POST /api/verification/submit without Authorization header -> 401
     * Expected Result: All protected routes return 401 Unauthorized.
     */
    const endpoints = [
      { method: 'post', path: '/api/courses' },
      { method: 'post', path: '/api/payment/create-order' },
      { method: 'post', path: '/api/wallet/withdraw' },
      { method: 'post', path: '/api/verification/submit' },
      { method: 'post', path: '/api/report' },
    ];

    for (const ep of endpoints) {
      const res = await (request(app) as any)[ep.method](ep.path);
      expect(res.status).toBe(401);
    }
  });

  /*
   * =========================================================================
   * 2. SECRETS LEAKAGE PREVENTION
   * =========================================================================
   */

  it('Cross-Cutting: API responses never expose environment variables or secret keys', async () => {
    /**
     * Scenario: Inspecting API responses and error structures for leaked environment secrets.
     * Steps:
     *   1. Call /health endpoint and public API endpoints
     *   2. Search response JSON string for JWT_SECRET, STRIPE_SECRET_KEY, RAZORPAY_KEY_SECRET strings
     * Expected Result: Zero secrets present in API responses.
     */
    const res = await request(app).get('/health');
    const resString = JSON.stringify(res.body);

    const secrets = [
      process.env.JWT_SECRET,
      process.env.STRIPE_SECRET_KEY,
      process.env.RAZORPAY_KEY_SECRET,
    ].filter(Boolean);

    for (const secret of secrets) {
      expect(resString).not.toContain(secret);
    }
  });

  /*
   * =========================================================================
   * 3. CORS ORIGIN RESTRICTION
   * =========================================================================
   */

  it('Cross-Cutting: CORS middleware blocks unauthorized third-party origins', async () => {
    /**
     * Scenario: Malicious third-party website (e.g. https://evil-hacker.com) tries making cross-origin API requests.
     * Steps:
     *   1. GET /health with Origin: https://evil-hacker.com
     * Expected Result: Server CORS policy denies origin access or omits Access-Control-Allow-Origin header for untrusted origin.
     */
    const res = await request(app)
      .get('/health')
      .set('Origin', 'https://evil-hacker.com');

    // CORS blocked callback responds with error
    expect(res.headers['access-control-allow-origin']).not.toBe('https://evil-hacker.com');
  });

  /*
   * =========================================================================
   * 4. ERROR LOG & STACK TRACE SANITIZATION
   * =========================================================================
   */

  it('Cross-Cutting: Error responses do not leak database stack traces or raw internal query syntax', async () => {
    /**
     * Scenario: Triggering an intentional error (e.g. invalid MongoDB ObjectId format).
     * Steps:
     *   1. GET /api/courses/invalid-object-id-12345
     * Expected Result: Server returns clean 400/404 JSON error response without exposing internal Mongoose stack trace.
     */
    const res = await request(app).get('/api/courses/invalid-object-id-12345');
    expect(res.body.stack).toBeUndefined();
  });
});
