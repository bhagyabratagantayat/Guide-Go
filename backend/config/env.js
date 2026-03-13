const dotenvSafe = require('dotenv-safe');
const path = require('path');

// Load environment variables from .env file and validate against .env.example
dotenvSafe.config({
  path: path.resolve(__dirname, '../.env'),
  example: path.resolve(__dirname, '../.env.example'),
  allowEmptyValues: true
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ WARNING: EMAIL_USER or EMAIL_PASS is missing in .env file. OTP emails will fail to send. Please configure them to enable full authentication flow.');
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

module.exports = config;
