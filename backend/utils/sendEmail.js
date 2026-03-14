const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('./logger');

const sendEmail = async (options) => {
  logger.info(`Attempting to send email to: ${options.email}`);
  
  if (!config.email.user || !config.email.pass) {
    logger.warn(`Email credentials missing. USER: ${!!config.email.user}, PASS: ${!!config.email.pass}`);
    return;
  }

  try {
    console.log(`Sending email to: ${options.email}`);
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"GuideGo" <${config.email.user}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}. Message ID: ${info.messageId}`);
    logger.info(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Email sending failed for ${options.email}:`, error);
    logger.error(`Error sending email: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
