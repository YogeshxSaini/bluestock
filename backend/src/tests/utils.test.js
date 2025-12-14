import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { validatePhoneNumber } from '../utils/phone.js';
import { isValidEmail, isValidUrl, validatePassword, sanitizeText } from '../utils/validation.js';

describe('Utility Functions Tests', () => {
  describe('Password Utils', () => {
    const plainPassword = 'TestPassword123!';

    it('should hash password correctly', async () => {
      const hashed = await hashPassword(plainPassword);
      expect(hashed).toBeTruthy();
      expect(hashed).not.toBe(plainPassword);
    });

    it('should compare passwords correctly', async () => {
      const hashed = await hashPassword(plainPassword);
      const isValid = await comparePassword(plainPassword, hashed);
      expect(isValid).toBe(true);
    });

    it('should fail comparison with wrong password', async () => {
      const hashed = await hashPassword(plainPassword);
      const isValid = await comparePassword('WrongPassword', hashed);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Utils', () => {
    const payload = { userId: 123, email: 'test@example.com' };

    it('should generate JWT token', () => {
      const token = generateToken(payload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should verify valid token', () => {
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });
  });

  describe('Phone Utils', () => {
    it('should validate correct phone number', () => {
      const result = validatePhoneNumber('+12345678901');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBeTruthy();
    });

    it('should reject invalid phone number', () => {
      const result = validatePhoneNumber('123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Validation Utils', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should validate correct URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should reject invalid URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });

    it('should validate strong password', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
    });

    it('should reject weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some((err) => err !== null)).toBe(true);
    });

    it('should sanitize HTML from text', () => {
      const dirty = '<script>alert("xss")</script>Hello';
      const clean = sanitizeText(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('Hello');
    });
  });
});
