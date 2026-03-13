const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to winston
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404, 'RESOURCE_NOT_FOUND');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400, 'DUPLICATE_FIELD');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400, 'VALIDATION_ERROR');
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Not authorized, token failed', 401, 'UNAUTHORIZED');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Not authorized, token expired', 401, 'TOKEN_EXPIRED');
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    errorCode: error.errorCode || 'SERVER_ERROR',
  });
};

module.exports = errorHandler;
