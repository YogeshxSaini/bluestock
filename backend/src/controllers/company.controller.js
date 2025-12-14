import { body } from 'express-validator';
import {
  createCompanyProfile,
  getCompanyByOwnerId,
  updateCompanyProfile,
  updateCompanyLogo,
  updateCompanyBanner,
} from '../services/company.service.js';
import { uploadLogo, uploadBanner } from '../services/cloudinary.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Register a new company
 * POST /api/company/register
 */
export const registerCompany = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Check if company already exists for this user
    const existingCompany = await getCompanyByOwnerId(ownerId);
    if (existingCompany) {
      return sendError(res, 'Company profile already exists for this user', 409);
    }

    const companyData = {
      owner_id: ownerId,
      company_name: req.body.company_name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      postal_code: req.body.postal_code,
      website: req.body.website,
      industry: req.body.industry,
      founded_date: req.body.founded_date,
      description: req.body.description,
      social_links: req.body.social_links,
    };

    const company = await createCompanyProfile(companyData);

    sendSuccess(res, 'Company registered successfully', { company }, 201);
  } catch (error) {
    console.error('Company registration error:', error);
    sendError(res, error.message || 'Company registration failed', 500);
  }
};

/**
 * Get company profile
 * GET /api/company/profile
 */
export const getCompanyProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const company = await getCompanyByOwnerId(ownerId);

    if (!company) {
      return sendError(res, 'Company profile not found', 404);
    }

    sendSuccess(res, 'Company profile retrieved', { company });
  } catch (error) {
    console.error('Get company profile error:', error);
    sendError(res, error.message || 'Failed to get company profile', 500);
  }
};

/**
 * Update company profile
 * PUT /api/company/profile
 */
export const updateCompany = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Check if company exists
    const existingCompany = await getCompanyByOwnerId(ownerId);
    if (!existingCompany) {
      return sendError(res, 'Company profile not found', 404);
    }

    const updates = {
      company_name: req.body.company_name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      postal_code: req.body.postal_code,
      website: req.body.website,
      industry: req.body.industry,
      founded_date: req.body.founded_date,
      description: req.body.description,
      social_links: req.body.social_links,
    };

    // Remove undefined values
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    const updatedCompany = await updateCompanyProfile(ownerId, updates);

    sendSuccess(res, 'Company profile updated successfully', { company: updatedCompany });
  } catch (error) {
    console.error('Update company error:', error);
    sendError(res, error.message || 'Failed to update company profile', 500);
  }
};

/**
 * Upload company logo
 * POST /api/company/upload-logo
 */
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    const ownerId = req.user.id;

    // Check if company exists
    const existingCompany = await getCompanyByOwnerId(ownerId);
    if (!existingCompany) {
      return sendError(res, 'Company profile not found. Please create a company first.', 404);
    }

    // Upload to Cloudinary
    const uploadResult = await uploadLogo(req.file.buffer);

    // Update company profile with logo URL
    const updatedCompany = await updateCompanyLogo(ownerId, uploadResult.url);

    sendSuccess(res, 'Logo uploaded successfully', {
      logo_url: uploadResult.url,
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    sendError(res, error.message || 'Failed to upload logo', 500);
  }
};

/**
 * Upload company banner
 * POST /api/company/upload-banner
 */
export const uploadCompanyBanner = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    const ownerId = req.user.id;

    // Check if company exists
    const existingCompany = await getCompanyByOwnerId(ownerId);
    if (!existingCompany) {
      return sendError(res, 'Company profile not found. Please create a company first.', 404);
    }

    // Upload to Cloudinary
    const uploadResult = await uploadBanner(req.file.buffer);

    // Update company profile with banner URL
    const updatedCompany = await updateCompanyBanner(ownerId, uploadResult.url);

    sendSuccess(res, 'Banner uploaded successfully', {
      banner_url: uploadResult.url,
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Upload banner error:', error);
    sendError(res, error.message || 'Failed to upload banner', 500);
  }
};

// Validation rules
export const registerCompanyValidation = [
  body('company_name').trim().notEmpty().withMessage('Company name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('postal_code').trim().notEmpty().withMessage('Postal code is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('website').optional().isURL().withMessage('Valid website URL is required'),
  body('founded_date').optional().isISO8601().withMessage('Valid date is required'),
];

export const updateCompanyValidation = [
  body('company_name').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
  body('postal_code').optional().trim().notEmpty().withMessage('Postal code cannot be empty'),
  body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
  body('website').optional().isURL().withMessage('Valid website URL is required'),
  body('founded_date').optional().isISO8601().withMessage('Valid date is required'),
];

export default {
  registerCompany,
  getCompanyProfile,
  updateCompany,
  uploadCompanyLogo,
  uploadCompanyBanner,
  registerCompanyValidation,
  updateCompanyValidation,
};
