import express from 'express';
import {
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
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
router.get('/verify-email', verifyEmail);

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to mobile number
 * @access  Public
 */
router.post('/send-otp', sendOTPValidation, validate, sendOTP);

/**
 * @route   POST /api/auth/verify-mobile
 * @desc    Verify mobile OTP
 * @access  Public
 */
router.post('/verify-mobile', verifyMobileValidation, validate, verifyMobile);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
router.get('/me', authMiddleware, getCurrentUser);

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Protected
 */
router.put('/me', authMiddleware, updateCurrentUser);

/**
 * @route   PUT /api/auth/phone
 * @desc    Update current user's phone number
 * @access  Protected
 */
router.put('/phone', authMiddleware, updatePhone);

/**
 * @route   PUT /api/auth/password
 * @desc    Change current user's password
 * @access  Protected
 */
router.put('/password', authMiddleware, changePassword);

export default router;
