import { query } from '../config/database.js';
import { sanitizeText, isValidUrl } from '../utils/validation.js';

/**
 * Create a new company profile
 * @param {Object} companyData - Company data
 * @returns {Promise<Object>} Created company profile
 */
export const createCompanyProfile = async (companyData) => {
  const {
    owner_id,
    company_name,
    address,
    city,
    state,
    country,
    postal_code,
    website,
    industry,
    founded_date,
    description,
    social_links,
  } = companyData;

  // Validate website URL if provided
  if (website && !isValidUrl(website)) {
    throw new Error('Invalid website URL');
  }

  // Sanitize description
  const sanitizedDescription = description ? sanitizeText(description) : null;

  // Validate social links if provided
  if (social_links) {
    const links = typeof social_links === 'string' ? JSON.parse(social_links) : social_links;
    Object.values(links).forEach((url) => {
      if (url && !isValidUrl(url)) {
        throw new Error('Invalid social media URL');
      }
    });
  }

  const result = await query(
    `INSERT INTO company_profile (
      owner_id, company_name, address, city, state, country, postal_code,
      website, industry, founded_date, description, social_links
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website || null,
      industry,
      founded_date || null,
      sanitizedDescription,
      social_links ? JSON.stringify(social_links) : null,
    ]
  );

  return result.rows[0];
};

/**
 * Get company profile by owner ID
 * @param {number} ownerId - Owner user ID
 * @returns {Promise<Object|null>} Company profile or null
 */
export const getCompanyByOwnerId = async (ownerId) => {
  const result = await query('SELECT * FROM company_profile WHERE owner_id = $1', [ownerId]);
  return result.rows[0] || null;
};

/**
 * Get company profile by ID
 * @param {number} id - Company profile ID
 * @returns {Promise<Object|null>} Company profile or null
 */
export const getCompanyById = async (id) => {
  const result = await query('SELECT * FROM company_profile WHERE id = $1', [id]);
  return result.rows[0] || null;
};

/**
 * Update company profile
 * @param {number} ownerId - Owner user ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated company profile
 */
export const updateCompanyProfile = async (ownerId, updates) => {
  const allowedFields = [
    'company_name',
    'address',
    'city',
    'state',
    'country',
    'postal_code',
    'website',
    'industry',
    'founded_date',
    'description',
    'social_links',
    'logo_url',
    'banner_url',
  ];

  const fields = [];
  const values = [];
  let paramIndex = 1;

  // Build dynamic query
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      // Sanitize description
      if (key === 'description' && updates[key]) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(sanitizeText(updates[key]));
      }
      // Validate URLs
      else if ((key === 'website' || key === 'logo_url' || key === 'banner_url') && updates[key]) {
        if (!isValidUrl(updates[key])) {
          throw new Error(`Invalid URL for ${key}`);
        }
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
      }
      // Handle social_links JSON
      else if (key === 'social_links' && updates[key]) {
        const links = typeof updates[key] === 'string' ? JSON.parse(updates[key]) : updates[key];
        Object.values(links).forEach((url) => {
          if (url && !isValidUrl(url)) {
            throw new Error('Invalid social media URL');
          }
        });
        fields.push(`${key} = $${paramIndex}`);
        values.push(JSON.stringify(links));
      } else {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
      }
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(ownerId);

  const result = await query(
    `UPDATE company_profile SET ${fields.join(', ')} WHERE owner_id = $${paramIndex}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Company profile not found');
  }

  return result.rows[0];
};

/**
 * Update company logo URL
 * @param {number} ownerId - Owner user ID
 * @param {string} logoUrl - Logo URL
 * @returns {Promise<Object>} Updated company profile
 */
export const updateCompanyLogo = async (ownerId, logoUrl) => {
  return updateCompanyProfile(ownerId, { logo_url: logoUrl });
};

/**
 * Update company banner URL
 * @param {number} ownerId - Owner user ID
 * @param {string} bannerUrl - Banner URL
 * @returns {Promise<Object>} Updated company profile
 */
export const updateCompanyBanner = async (ownerId, bannerUrl) => {
  return updateCompanyProfile(ownerId, { banner_url: bannerUrl });
};

/**
 * Delete company profile
 * @param {number} ownerId - Owner user ID
 * @returns {Promise<boolean>} Deletion success
 */
export const deleteCompanyProfile = async (ownerId) => {
  const result = await query('DELETE FROM company_profile WHERE owner_id = $1 RETURNING id', [
    ownerId,
  ]);
  return result.rows.length > 0;
};

export default {
  createCompanyProfile,
  getCompanyByOwnerId,
  getCompanyById,
  updateCompanyProfile,
  updateCompanyLogo,
  updateCompanyBanner,
  deleteCompanyProfile,
};
