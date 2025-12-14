import request from 'supertest';
import app from '../server.js';
import { query } from '../config/database.js';

describe('Auth API Tests', () => {
  let testUserId;
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    full_name: 'Test User',
    gender: 'm',
    // Generate a valid-looking US E.164 number with unique line number
    mobile_no: `+1415555${Math.floor(1000 + Math.random() * 9000)}`,
  };

  // Cleanup after tests
  afterAll(async () => {
    if (testUserId) {
      await query('DELETE FROM users WHERE id = $1', [testUserId]);
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('user_id');
      expect(response.body.data.user.email).toBe(testUser.email);

      testUserId = response.body.data.user.user_id;
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser).expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      const response = await request(app).post('/api/auth/register').send(invalidUser).expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with weak password', async () => {
      const weakPasswordUser = {
        ...testUser,
        email: `test${Date.now()}@example.com`,
        password: 'weak',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify-mobile', () => {
    it('should verify mobile OTP successfully', async () => {
      // First send OTP to store it
      const otpResponse = await request(app)
        .post('/api/auth/send-otp')
        .send({
          user_id: testUserId,
        })
        .expect(200);

      // Extract the mock OTP from the response data
      const mockOTP = otpResponse.body.data.mockOTP;

      // Then verify the OTP
      const response = await request(app)
        .post('/api/auth/verify-mobile')
        .send({
          user_id: testUserId,
          otp: mockOTP,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('verified successfully');
    });

    it('should fail with invalid OTP format', async () => {
      const response = await request(app)
        .post('/api/auth/verify-mobile')
        .send({
          user_id: testUserId,
          otp: '12345', // Only 5 digits
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      authToken = loginResponse.body.data.token;
    });

    it('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should fail without token', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
