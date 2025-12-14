import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize HTML content
 * @param {string} dirty - Unsanitized HTML
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized HTML
 */
export const sanitize = (dirty, options = {}) => {
  const defaultOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    allowedAttributes: {
      a: ['href', 'target'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  };

  return sanitizeHtml(dirty, { ...defaultOptions, ...options });
};

/**
 * Sanitize plain text (remove all HTML)
 * @param {string} dirty - Unsanitized text
 * @returns {string} Plain text
 */
export const sanitizeText = (dirty) => {
  return sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Validation result
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requires: min 8 chars, 1 uppercase, 1 number, 1 special char
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= minLength;

  const isValid = hasUppercase && hasNumber && hasSpecialChar && isLongEnough;

  return {
    isValid,
    errors: {
      minLength: !isLongEnough ? `Password must be at least ${minLength} characters` : null,
      uppercase: !hasUppercase ? 'Password must contain at least one uppercase letter' : null,
      number: !hasNumber ? 'Password must contain at least one number' : null,
      specialChar: !hasSpecialChar ? 'Password must contain at least one special character' : null,
    },
  };
};

export default {
  sanitize,
  sanitizeText,
  isValidUrl,
  isValidEmail,
  validatePassword,
};
