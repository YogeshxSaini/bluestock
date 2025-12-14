import createError from 'http-errors';
import { sendError } from '../utils/response.js';
import config from '../config/index.js';

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  next(createError(404, `Route ${req.originalUrl} not found`));
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, _next) => {
  // Set status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Prepare error message
  let message = err.message || 'Internal server error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    message = 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    message = 'Unauthorized access';
  } else if (err.code === '23505') {
    // PostgreSQL unique violation
    message = 'Duplicate entry found';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    message = 'Referenced record not found';
  }

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  // Send error response
  sendError(
    res,
    message,
    statusCode,
    config.nodeEnv === 'development' ? { stack: err.stack } : null
  );
};

export default {
  notFoundHandler,
  errorHandler,
};
