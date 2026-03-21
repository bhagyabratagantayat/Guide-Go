const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const authenticateUser = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new ErrorResponse('User no longer exists', 401, 'UNAUTHORIZED'));
    }
    return next();
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized, no token', 401, 'UNAUTHORIZED'));
  }
});

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorResponse(`Role ${req.user ? req.user.role : 'unauthorized'} is not authorized to access this route`, 403, 'FORBIDDEN'));
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
