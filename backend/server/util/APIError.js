export default class APIError extends Error {
  constructor(statusCode, errors, ...args) {
    super(...args);
    Error.captureStackTrace(this, APIError);
    this.statusCode = statusCode;

    // console.log(" ===== errors: ", errors)

    if (typeof errors === 'string') {
      this.message = errors;
    } else {
      this.errors = errors;
    }
  }
}
