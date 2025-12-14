import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Validate and format phone number
 * @param {string} phoneNumber - Phone number with country code
 * @returns {Object} Validation result
 */
export const validatePhoneNumber = (phoneNumber) => {
  try {
    if (!phoneNumber) {
      return {
        isValid: false,
        error: 'Phone number is required',
      };
    }

    // Check if phone number is valid
    if (!isValidPhoneNumber(phoneNumber)) {
      return {
        isValid: false,
        error: 'Invalid phone number format',
      };
    }

    // Parse and format phone number
    const parsed = parsePhoneNumber(phoneNumber);
    
    return {
      isValid: true,
      formatted: parsed.format('E.164'), // International format: +1234567890
      country: parsed.country,
      nationalNumber: parsed.nationalNumber,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid phone number',
    };
  }
};

/**
 * Format phone number to E.164 format
 * @param {string} phoneNumber - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed.format('E.164');
  } catch (error) {
    return phoneNumber;
  }
};

export default {
  validatePhoneNumber,
  formatPhoneNumber,
};
