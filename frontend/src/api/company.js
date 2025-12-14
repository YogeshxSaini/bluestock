import apiClient from './client';

/**
 * Register a new company
 * @param {Object} companyData - Company registration data
 */
export const registerCompany = async (companyData) => {
  return apiClient.post('/company/register', companyData);
};

/**
 * Get company profile
 */
export const getCompanyProfile = async () => {
  try {
    return await apiClient.get('/company/profile');
  } catch (error) {
    // Return proper structure for 404 (company not found) instead of throwing
    if (error.status === 404) {
      return { data: { company: null } };
    }
    throw error;
  }
};

/**
 * Update company profile
 * @param {Object} updates - Fields to update
 */
export const updateCompanyProfile = async (updates) => {
  return apiClient.put('/company/profile', updates);
};

/**
 * Upload company logo
 * @param {File} file - Logo file
 */
export const uploadCompanyLogo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post('/company/upload-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Upload company banner
 * @param {File} file - Banner file
 */
export const uploadCompanyBanner = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post('/company/upload-banner', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  registerCompany,
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
  uploadCompanyBanner,
};
