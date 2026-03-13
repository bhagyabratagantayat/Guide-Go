const express = require('express');
const { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  forgotPassword, 
  resetPassword, 
  getProfile 
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateVerifyOTP, 
  validateForgotPassword, 
  validateResetPassword 
} = require('../middleware/validator');

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/profile', authenticateUser, getProfile);

module.exports = router;
