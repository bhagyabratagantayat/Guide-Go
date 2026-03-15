const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('./logger');

const sendEmail = async (options) => {
  logger.info(`Attempting to send email to: ${options.email} using Brevo SMTP`);
  
  if (!config.email.smtpUser || !config.email.smtpPass) {
    logger.warn(`Brevo SMTP credentials missing. USER: ${!!config.email.smtpUser}, PASS: ${!!config.email.smtpPass}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.email.smtpHost,
      port: config.email.smtpPort,
      secure: config.email.smtpPort == 465,
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"GuideGo" <${config.email.from}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Email sending failed for ${options.email}: ${error.message}`);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
