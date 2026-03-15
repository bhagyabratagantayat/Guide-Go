const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
  // 1. Create a transporter using Brevo SMTP details from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: `GuideGo <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  // 3. Send the email and log status
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    logger.info(`Message sent to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email delivery failed: ${error.message}`);
    logger.error(`Failed to send email to ${options.email}: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
