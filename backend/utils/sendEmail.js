const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('./logger');

/**
 * Sends email using Nodemailer SMTP
 */
const sendEmail = async (options) => {
  logger.info(`>>> ATTEMPTING SMTP DELIVERY: ${options.email} <<<`);

  const transporter = nodemailer.createTransport({
    host: config.email.smtpHost,
    port: config.email.smtpPort,
    secure: config.email.smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: config.email.smtpUser,
      pass: config.email.smtpPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"GuideGo Support" <${config.email.from}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage || options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`🚀 SMTP EMAIL SENT: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ SMTP FAILURE for ${options.email}: ${error.message}`);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
