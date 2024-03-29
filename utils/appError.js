class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperationError = false;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = appError;
