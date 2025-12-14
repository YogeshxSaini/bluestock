import { query, getClient } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { validatePhoneNumber } from '../utils/phone.js';
import { isValidEmail } from '../utils/validation.js';

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  const { email, password, full_name, signup_type, gender, mobile_no, firebase_uid } = userData;

  // Validate email
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate phone number
  const phoneValidation = validatePhoneNumber(mobile_no);
  if (!phoneValidation.isValid) {
    throw new Error(phoneValidation.error);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Insert user
  const result = await query(
    `INSERT INTO users (email, password, full_name, signup_type, gender, mobile_no, firebase_uid)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, full_name, signup_type, gender, mobile_no, firebase_uid, is_mobile_verified, is_email_verified, created_at`,
    [email, hashedPassword, full_name, signup_type || 'e', gender, phoneValidation.formatted, firebase_uid]
  );

  return result.rows[0];
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User or null
 */
export const findUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User or null
 */
export const findUserById = async (id) => {
  const result = await query(
    'SELECT id, email, full_name, signup_type, gender, mobile_no, is_mobile_verified, is_email_verified, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Find user by mobile number
 * @param {string} mobile_no - Mobile number
 * @returns {Promise<Object|null>} User or null
 */
export const findUserByMobile = async (mobile_no) => {
  const result = await query('SELECT * FROM users WHERE mobile_no = $1', [mobile_no]);
  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object|null>} User if valid, null otherwise
 */
export const verifyUserPassword = async (email, password) => {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);
  
  if (!isValid) {
    return null;
  }

  // Remove password from returned user object
  // eslint-disable-next-line no-unused-vars
  const { password: _pwd, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Update email verification status
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Updated user
 */
export const verifyUserEmail = async (userId) => {
  const result = await query(
    `UPDATE users SET is_email_verified = true WHERE id = $1
     RETURNING id, email, full_name, is_email_verified`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Update mobile verification status
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Updated user
 */
export const verifyUserMobile = async (userId) => {
  const result = await query(
    `UPDATE users SET is_mobile_verified = true WHERE id = $1
     RETURNING id, mobile_no, is_mobile_verified`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, updates) => {
  const allowedFields = ['full_name', 'gender'];
  const fields = [];
  const values = [];
  let paramIndex = 1;

  // Build dynamic query
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(userId);

  const result = await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
     RETURNING id, email, full_name, gender, mobile_no, is_email_verified, is_mobile_verified`,
    values
  );

  return result.rows[0];
};

/**
 * Update user phone number with E.164 validation
 * @param {number} userId
 * @param {string} mobile_no
 * @returns {Promise<Object>} Updated user
 */
export const updateUserPhone = async (userId, mobile_no) => {
  const phoneValidation = validatePhoneNumber(mobile_no);
  if (!phoneValidation.isValid) {
    throw new Error(phoneValidation.error);
  }

  const result = await query(
    `UPDATE users SET mobile_no = $1, is_mobile_verified = false WHERE id = $2
     RETURNING id, email, full_name, gender, mobile_no, is_email_verified, is_mobile_verified`,
    [phoneValidation.formatted, userId]
  );

  return result.rows[0];
};

/**
 * Change user password after validating current password
 * @param {number} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const client = await getClient();
  try {
    const { rows } = await client.query('SELECT password FROM users WHERE id = $1', [userId]);
    const row = rows[0];
    if (!row) {
      throw new Error('User not found');
    }
    const isValid = await comparePassword(currentPassword, row.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const hashed = await hashPassword(newPassword);
    await client.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);
  } finally {
    client.release();
  }
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByMobile,
  verifyUserPassword,
  verifyUserEmail,
  verifyUserMobile,
  updateUser,
  updateUserPhone,
  changeUserPassword,
};
