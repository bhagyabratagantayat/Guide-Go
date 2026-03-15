const config = require('../config/env');
const logger = require('./logger');

/**
 * Sends email using Brevo HTTP API (Port 443)
 * This bypasses firewalls that block standard SMTP ports (25, 587, 465, 2525)
 */
const sendEmail = async (options) => {
  logger.info(`>>> BREVO HTTP API INITIATED: ${options.email} <<<`);
  
  // Strict check and trimming
  const rawKey = config.email.smtpPass || "";
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, ''); // Remove spaces and quotes
  
  if (!apiKey) {
    logger.error(`❌ CRITICAL: Brevo API Key is missing or empty. Delivery aborted.`);
    return;
  }

  // Security-safe diagnostic
  logger.info(`🔍 API Key Diagnostic: Length=${apiKey.length}, Suffix=...${apiKey.slice(-4)}`);

  const payload = {
    sender: { name: "GuideGo Support", email: config.email.from },
    to: [{ email: options.email }],
    subject: options.subject,
    htmlContent: options.htmlMessage || options.message,
    textContent: options.message
  };

  try {
    logger.info(`📤 Sending POST request to Brevo API (https://api.brevo.com/v3/smtp/email)...`);
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'x-sib-api-key': apiKey // Fallback for older/specific API versions
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    logger.info(`🚀 API EMAIL SENT SUCCESSFULLY! MessageId: ${data.messageId || 'N/A'}`);
    return data;
  } catch (error) {
    logger.error(`❌ FINAL API FAILURE for ${options.email}: ${error.message}`);
    throw new Error(`[V5-API] Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
