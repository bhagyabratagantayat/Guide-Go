const dotenvSafe = require('dotenv-safe');
const path = require('path');

// Load environment variables from .env file and validate against .env.example
dotenvSafe.config({
  path: path.resolve(__dirname, '../.env'),
  example: path.resolve(__dirname, '../.env.example'),
  allowEmptyValues: true
});

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('⚠️ WARNING: SMTP_USER or SMTP_PASS (Brevo) is missing in .env file. Emails will fail to send. Please configure them to enable full authentication flow.');
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'guidego_refresh_secret_key_2026',
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
    smtpHost: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 2525,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'guidego2026@gmail.com'
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

console.log('🚀 SYSTEM STARTING WITH CONFIG:');
console.log(`- SMTP Host: ${config.email.smtpHost}`);
console.log(`- SMTP Port: ${config.email.smtpPort}`);
console.log(`- SMTP User: ${config.email.smtpUser ? config.email.smtpUser.substring(0, 4) + '...' : 'MISSING'}`);
console.log(`- SMTP Pass: ${config.email.smtpPass ? '******' : 'MISSING'}`);

module.exports = config;
