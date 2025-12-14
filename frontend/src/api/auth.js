import apiClient from './client';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 */
export const registerUser = async (userData) => {
  return apiClient.post('/auth/register', userData);
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 */
export const loginUser = async (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

/**
 * Verify email
 * @param {number} userId - User ID
 */
export const verifyEmail = async (userId) => {
  return apiClient.get(`/auth/verify-email?userId=${userId}`);
};

/**
 * Send OTP to mobile number
 * @param {number} userId - User ID
 */
export const sendOTP = async (userId) => {
  return apiClient.post('/auth/send-otp', { user_id: userId });
};

/**
 * Verify mobile OTP
 * @param {number} userId - User ID
 * @param {string} otp - OTP code
 */
export const verifyMobileOTP = async (userId, otp) => {
  return apiClient.post('/auth/verify-mobile', { user_id: userId, otp });
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  return apiClient.get('/auth/me');
};

/**
 * Update current user profile
 * @param {Object} updates - Fields to update (e.g., full_name, gender)
 */
export const updateProfile = async (updates) => {
  return apiClient.put('/auth/me', updates);
};

/**
 * Update phone number
 * @param {string} mobile_no - E.164 formatted phone
 */
export const updatePhone = async (mobile_no) => {
  return apiClient.put('/auth/phone', { mobile_no });
};

/**
 * Change password
 * @param {Object} payload - { current_password, new_password }
 */
export const changePassword = async (payload) => {
  return apiClient.put('/auth/password', payload);
};

export default {
  registerUser,
  loginUser,
  sendOTP,
  verifyEmail,
  verifyMobileOTP,
  getCurrentUser,
  updateProfile,
  updatePhone,
  changePassword,
};
