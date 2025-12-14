import request from 'supertest';
import app from '../server.js';
import { query } from '../config/database.js';

describe('Company API Tests', () => {
  let testUserId;
  let authToken;
  let companyId;

  const testUser = {
    email: `company${Date.now()}@example.com`,
    password: 'CompanyPass123!',
    full_name: 'Company Test User',
    gender: 'm',
    mobile_no: `+1415555${Math.floor(1000 + Math.random() * 9000)}`,
  };

  const testCompany = {
    company_name: 'Test Company Inc',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    country: 'USA',
    postal_code: '12345',
    website: 'https://testcompany.com',
    industry: 'Technology',
    founded_date: '2020-01-01',
    description: 'A test company for automated testing',
    social_links: {
      linkedin: 'https://linkedin.com/company/testcompany',
      twitter: 'https://twitter.com/testcompany',
    },
  };

  // Setup before tests
  beforeAll(async () => {
    // Create test user
    const registerResponse = await request(app).post('/api/auth/register').send(testUser);
    testUserId = registerResponse.body.data.user.user_id;

    // Login to get token
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    authToken = loginResponse.body.data.token;
  });

  // Cleanup after tests
  afterAll(async () => {
    if (companyId) {
      await query('DELETE FROM company_profile WHERE id = $1', [companyId]);
    }
    if (testUserId) {
      await query('DELETE FROM users WHERE id = $1', [testUserId]);
    }
  });

  describe('POST /api/company/register', () => {
    it('should register a new company successfully', async () => {
      const response = await request(app)
        .post('/api/company/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCompany)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registered successfully');
      expect(response.body.data.company).toHaveProperty('id');
      expect(response.body.data.company.company_name).toBe(testCompany.company_name);

      companyId = response.body.data.company.id;
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/api/company/register').send(testCompany).expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate company for same user', async () => {
      const response = await request(app)
        .post('/api/company/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCompany)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail with missing required fields', async () => {
      const invalidCompany = {
        company_name: 'Test Company',
        // Missing other required fields
      };
      const response = await request(app)
        .post('/api/company/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCompany)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/company/profile', () => {
    it('should get company profile successfully', async () => {
      const response = await request(app)
        .get('/api/company/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.company.company_name).toBe(testCompany.company_name);
      expect(response.body.data.company.owner_id).toBe(testUserId);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/company/profile').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/company/profile', () => {
    it('should update company profile successfully', async () => {
      const updates = {
        company_name: 'Updated Test Company',
        description: 'Updated description for testing',
      };

      const response = await request(app)
        .put('/api/company/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.company.company_name).toBe(updates.company_name);
      expect(response.body.data.company.description).toBe(updates.description);
    });

    it('should fail with invalid website URL', async () => {
      const updates = {
        website: 'not-a-valid-url',
      };

      const response = await request(app)
        .put('/api/company/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).put('/api/company/profile').send({}).expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/company/upload-logo', () => {
    it('should fail without file', async () => {
      const response = await request(app)
        .post('/api/company/upload-logo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No file');
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/api/company/upload-logo').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/company/upload-banner', () => {
    it('should fail without file', async () => {
      const response = await request(app)
        .post('/api/company/upload-banner')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No file');
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/api/company/upload-banner').expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
