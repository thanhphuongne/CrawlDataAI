export default class APIError extends Error {
  constructor(statusCode, errors, ...args) {
    super(...args);
    Error.captureStackTrace(this, APIError);
    this.statusCode = statusCode;
    this.status = statusCode; // Add status alias for consistency

    if (typeof errors === 'string') {
      this.message = errors;
    } else {
      this.errors = errors;
      // If errors is an array with msg field, use first message as main message
      if (Array.isArray(errors) && errors.length > 0 && errors[0].msg) {
        this.message = errors[0].msg;
      }
    }
  }
}
