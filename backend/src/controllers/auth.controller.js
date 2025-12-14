import { body } from 'express-validator';
import { createUser, findUserByEmail, findUserById, verifyUserPassword, verifyUserEmail, verifyUserMobile, updateUser, updateUserPhone, changeUserPassword } from '../services/user.service.js';
import { createFirebaseUser, generateEmailVerificationLink, verifyFirebaseUser, generateCustomToken } from '../config/firebase.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validatePassword } from '../utils/validation.js';
import { validatePhoneNumber } from '../utils/phone.js';

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map(); // Format: { userId: { otp, expiresAt } }

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, full_name, gender, mobile_no, signup_type } = req.body;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const errors = Object.values(passwordValidation.errors).filter((err) => err !== null);
      return sendError(res, 'Password does not meet requirements', 400, errors);
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(mobile_no);
    if (!phoneValidation.isValid) {
      return sendError(res, phoneValidation.error, 400);
    }

    // Check if user already exists in database
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 409);
    }

    // Create user in Firebase
    let firebaseUser;
    try {
      firebaseUser = await createFirebaseUser({
        email,
        password,
        displayName: full_name,
        phoneNumber: phoneValidation.formatted
      });
    } catch (firebaseError) {
      console.error('Firebase user creation error:', firebaseError);
      return sendError(res, `Firebase registration failed: ${firebaseError.message}`, 500);
    }

    // Create user in database with Firebase UID
    const user = await createUser({
      email,
      password, // Store hashed password as fallback
      full_name,
      gender,
      mobile_no: phoneValidation.formatted,
      signup_type: signup_type || 'e',
      firebase_uid: firebaseUser.uid,
    });

    // Send email verification
    try {
      const verificationLink = await generateEmailVerificationLink(email);
      console.log('Email verification link generated:', verificationLink);
      // In production, send this link via email service
    } catch (emailError) {
      console.warn('Email verification link generation failed:', emailError);
      // Don't fail registration if email verification link generation fails
    }

    sendSuccess(
      res,
      'User registered successfully. Please verify your email and mobile number.',
      { 
        user: {
          user_id: user.id,
          email: user.email,
          full_name: user.full_name,
          mobile_no: user.mobile_no,
          firebase_uid: firebaseUser.uid,
        }
      },
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    sendError(res, error.message || 'Registration failed', 500);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify user credentials in local database
    const user = await verifyUserPassword(email, password);

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Verify user exists in Firebase (optional check)
    try {
      const firebaseUid = await verifyFirebaseUser(email);
      if (firebaseUid && firebaseUid !== user.firebase_uid) {
        console.warn('Firebase UID mismatch for user:', email);
      }
    } catch (firebaseError) {
      console.warn('Firebase verification failed during login:', firebaseError.message);
      // Continue with login even if Firebase verification fails
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      firebaseUid: user.firebase_uid,
    });

    sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        mobile_no: user.mobile_no,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
        firebase_uid: user.firebase_uid,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, error.message || 'Login failed', 500);
  }
};

/**
 * Verify email
 * GET /api/auth/verify-email?userId=<user-id>
 */
export const verifyEmail = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }


    // Update email verification status
    const updatedUser = await verifyUserEmail(parseInt(userId, 10));

    sendSuccess(res, 'Email verified successfully', {
      email: updatedUser.email,
      is_email_verified: updatedUser.is_email_verified,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    sendError(res, error.message || 'Email verification failed', 500);
  }
};

/**
 * Send OTP to mobile number
 * POST /api/auth/send-otp
 */
export const sendOTP = async (req, res) => {
  try {
    const { user_id, email } = req.body;

    if (!user_id && !email) {
      return sendError(res, 'User ID or email is required', 400);
    }

    // Get user details
    let user;
    if (user_id) {
      user = await findUserById(parseInt(user_id, 10));
    } else if (email) {
      user = await findUserByEmail(email);
    }
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (!user.mobile_no) {
      return sendError(res, 'Mobile number not found for user', 400);
    }

    // Generate a custom token for the user (can be used client-side for phone auth)
    let customToken = null;
    try {
      if (user.firebase_uid) {
        customToken = await generateCustomToken(user.firebase_uid);
      }
    } catch (firebaseError) {
      console.warn('Failed to generate custom token:', firebaseError.message);
    }

    // In production, integrate with Firebase Phone Auth or SMS service
    // For demo, we'll generate a mock OTP
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10-minute expiration
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(user.id.toString(), { otp: mockOTP, expiresAt });
    
    console.log(`📱 Mock OTP for ${user.mobile_no}: ${mockOTP}`);
    console.log(`📝 OTP stored for user ID: ${user.id} (expires in 10 minutes)`);
    
    sendSuccess(res, 'OTP sent successfully', {
      message: 'OTP sent to your mobile number',
      customToken, // Client can use this for Firebase phone verification
      // In development and test modes:
      ...(process.env.NODE_ENV !== 'production' && { mockOTP }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    sendError(res, error.message || 'Failed to send OTP', 500);
  }
};

/**
 * Verify mobile OTP
 * POST /api/auth/verify-mobile
 */
export const verifyMobile = async (req, res) => {
  try {
    const { user_id, otp } = req.body;

    if (!user_id || !otp) {
      return sendError(res, 'User ID and OTP are required', 400);
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return sendError(res, 'Invalid OTP format. Must be 6 digits.', 400);
    }

    console.log(`🔍 Verifying OTP for user ID: ${user_id}, entered OTP: ${otp}`);
    console.log(`📋 Current OTP store keys:`, Array.from(otpStore.keys()));

    // Check if OTP exists for this user
    const storedOtpData = otpStore.get(user_id.toString());
    console.log(`📦 Stored OTP data for user ${user_id}:`, storedOtpData);
    
    if (!storedOtpData) {
      return sendError(res, 'No OTP found. Please request a new OTP.', 400);
    }

    // Check if OTP has expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(user_id.toString()); // Clean up expired OTP
      return sendError(res, 'OTP has expired. Please request a new OTP.', 400);
    }

    // Verify OTP matches
    if (storedOtpData.otp !== otp) {
      return sendError(res, 'Invalid OTP. Please check and try again.', 400);
    }

    // OTP is valid, delete it (one-time use)
    otpStore.delete(user_id.toString());
    console.log(`✅ OTP verified successfully for user ID: ${user_id}`);

    // Update mobile verification status
    const updatedUser = await verifyUserMobile(parseInt(user_id, 10));

    sendSuccess(res, 'Mobile number verified successfully', {
      mobile_no: updatedUser.mobile_no,
      is_mobile_verified: updatedUser.is_mobile_verified,
    });
  } catch (error) {
    console.error('Mobile verification error:', error);
    sendError(res, error.message || 'Mobile verification failed', 500);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    // User attached by auth middleware
    sendSuccess(res, 'User profile retrieved', { user: req.user });
  } catch (error) {
    console.error('Get current user error:', error);
    sendError(res, error.message || 'Failed to get user profile', 500);
  }
};

/**
 * Update current user profile
 * PUT /api/auth/me
 */
export const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, gender } = req.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (gender !== undefined) updates.gender = gender;

    const updated = await updateUser(userId, updates);

    sendSuccess(res, 'User profile updated', { user: updated });
  } catch (error) {
    console.error('Update current user error:', error);
    sendError(res, error.message || 'Failed to update user profile', 400);
  }
};

/**
 * Update user phone number
 * PUT /api/auth/phone
 */
export const updatePhone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mobile_no } = req.body;

    const validation = validatePhoneNumber(mobile_no);
    if (!validation.isValid) {
      return sendError(res, 'Invalid phone number format', 400, [validation.error]);
    }

    const updated = await updateUserPhone(userId, mobile_no);
    sendSuccess(res, 'Phone updated', { user: updated });
  } catch (error) {
    console.error('Update phone error:', error);
    sendError(res, error.message || 'Failed to update phone', 400);
  }
};

/**
 * Change password
 * PUT /api/auth/password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return sendError(res, 'Current and new password are required', 400);
    }

    const pwdCheck = validatePassword(new_password);
    if (!pwdCheck.isValid) {
      const errors = Object.values(pwdCheck.errors).filter((e) => e);
      return sendError(res, 'New password does not meet requirements', 400, errors);
    }

    await changeUserPassword(userId, current_password, new_password);
    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, error.message || 'Failed to change password', 400);
  }
};

// Validation rules
export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('mobile_no').notEmpty().withMessage('Mobile number is required'),
  body('gender').optional().isIn(['m', 'f', 'o']).withMessage('Gender must be m, f, or o'),
  body('signup_type').optional().isIn(['e', 's', 'g']).withMessage('Invalid signup type'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const sendOTPValidation = [
  body('user_id')
    .optional()
    .isInt()
    .withMessage('User ID must be an integer'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
];

export const verifyMobileValidation = [
  body('user_id').isInt().withMessage('Valid user ID is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

export default {
  register,
  login,
  verifyEmail,
  sendOTP,
  verifyMobile,
  getCurrentUser,
  updateCurrentUser,
  updatePhone,
  changePassword,
  registerValidation,
  loginValidation,
  sendOTPValidation,
  verifyMobileValidation,
};
