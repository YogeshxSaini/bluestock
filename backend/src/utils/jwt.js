import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
};
