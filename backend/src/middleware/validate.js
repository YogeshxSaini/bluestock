import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return sendError(res, 'Validation failed', 400, formattedErrors);
  }

  next();
};

export default validate;
