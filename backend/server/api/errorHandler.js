/**
 * The final error handler for api call
 * @param {Error} error the error from prev middleware
 * @param req
 * @param res
 * @param next
 */
import logger from '../util/logger';

// eslint-disable-next-line no-unused-vars
export default function (error, req, res, next) {
  console.log('Error Handler:', error);
  
  if (!error.statusCode && !error.status) {
    logger.error(error.stack);
  }
  
  const statusCode = error.statusCode || error.status || 500;
  
  // Always return JSON response with consistent format
  const response = {
    success: false,
    message: error.message || 'Internal server error',
  };

  // Include errors array if available (for validation errors)
  if (error.errors) {
    response.errors = error.errors;
    // If no message but errors array exists, use first error message
    if (!error.message && Array.isArray(error.errors) && error.errors.length > 0) {
      response.message = error.errors[0].msg || error.errors[0].message || 'Validation error';
    }
  }

  console.log(`[Error Response] Status: ${statusCode}, Message: ${response.message}`);
  
  res.status(statusCode).json(response);
}
