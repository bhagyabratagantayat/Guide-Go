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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const mailOptions = {
      from: `"GuideGo" <${config.email.user}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Message sent: ${info.messageId}`);
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
