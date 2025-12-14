/**
 * Format success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
export const successResponse = (message, data = null, statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Validation errors or details
 * @returns {Object} Formatted response
 */
export const errorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
};

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json(successResponse(message, data, statusCode));
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Validation errors or details
 */
export const sendError = (res, message, statusCode = 500, errors = null) => {
  res.status(statusCode).json(errorResponse(message, statusCode, errors));
};

export default {
  successResponse,
  errorResponse,
  sendSuccess,
  sendError,
};
