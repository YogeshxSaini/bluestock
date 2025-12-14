import express from 'express';
import {
  registerCompany,
  getCompanyProfile,
  updateCompany,
  uploadCompanyLogo,
  uploadCompanyBanner,
  registerCompanyValidation,
  updateCompanyValidation,
} from '../controllers/company.controller.js';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

/**
 * @route   POST /api/company/register
 * @desc    Register a new company
 * @access  Protected
 */
router.post('/register', registerCompanyValidation, validate, registerCompany);

/**
 * @route   GET /api/company/profile
 * @desc    Get company profile
 * @access  Protected
 */
router.get('/profile', getCompanyProfile);

/**
 * @route   PUT /api/company/profile
 * @desc    Update company profile
 * @access  Protected
 */
router.put('/profile', updateCompanyValidation, validate, updateCompany);

/**
 * @route   POST /api/company/upload-logo
 * @desc    Upload company logo
 * @access  Protected
 */
router.post('/upload-logo', uploadSingle('file'), uploadCompanyLogo);

/**
 * @route   POST /api/company/upload-banner
 * @desc    Upload company banner
 * @access  Protected
 */
router.post('/upload-banner', uploadSingle('file'), uploadCompanyBanner);

export default router;
