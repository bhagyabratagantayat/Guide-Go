const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('./logger');

const sendEmail = async (options) => {
  logger.info(`>>> EMAIL DELIVERY INITIATED: ${options.email} <<<`);
  
  if (!config.email.smtpUser || !config.email.smtpPass) {
    logger.error(`❌ CRITICAL: Brevo SMTP credentials missing. Delivery aborted.`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.email.smtpHost,
      port: config.email.smtpPort,
      secure: config.email.smtpPort === 465,
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 20000
    });

    // Verify connection configuration
    logger.info(`🔍 Verifying SMTP connection to ${config.email.smtpHost}:${config.email.smtpPort}...`);
    try {
      await transporter.verify();
      logger.info(`✅ SMTP Connection Verified Successfully.`);
    } catch (verifyError) {
      logger.error(`❌ SMTP Verification Failed: ${verifyError.message}`);
      throw verifyError;
    }

    const mailOptions = {
      from: `"GuideGo Support" <${config.email.from}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage || options.message,
    };

    logger.info(`📤 Sending mail via Brevo Relay...`);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`🚀 EMAIL SENT SUCCESSFULLY! MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ FINAL EMAIL FAILURE for ${options.email}: ${error.message}`);
    // If it's a timeout, it might be Render's network
    if (error.code === 'ETIMEDOUT') {
      logger.error(`⚠️ Connection timed out. This often happens on Render Free Tier if the relay is slow.`);
    }
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
