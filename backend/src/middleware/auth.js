import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import { query } from '../config/database.js';

/**
 * JWT authentication middleware
 * Validates JWT token and attaches user to request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return sendError(res, error.message, 401);
    }

    // Get user from database
    const result = await query(
      'SELECT id, email, full_name, mobile_no, is_email_verified, is_mobile_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'User not found', 404);
    }

    // Attach user to request
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendError(res, 'Authentication failed', 500);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      
      const result = await query(
        'SELECT id, email, full_name, mobile_no FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (error) {
      // Token invalid or expired, continue without user
    }

    next();
  } catch (error) {
    next();
  }
};

export default authMiddleware;
