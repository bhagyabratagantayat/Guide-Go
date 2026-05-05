const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const authenticateUser = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized, no token provided', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log("AUTH ERROR: User not found for ID", decoded.id);
      return next(new ErrorResponse('Not authorized - user no longer exists', 401, 'UNAUTHORIZED'));
    }
    
    return next();
  } catch (error) {
    console.error('Auth Middleware Token Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    return next(new ErrorResponse('Not authorized, token failed', 401, 'UNAUTHORIZED'));
  }
});

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Admin always has access to admin routes
    if (req.user && req.user.role === 'admin') {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      console.error(`[AUTH] Role Blocked: ${req.user ? req.user.role : 'None'} tried to access ${req.originalUrl}`);
      return next(new ErrorResponse(`Role ${req.user ? req.user.role : 'unauthorized'} is not authorized to access this route`, 403, 'FORBIDDEN'));
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
