import nodemailer from 'nodemailer';
import { SENDER_EMAIL, SENDER_NAME } from '../config';

// Gmail SMTP Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'hoccode9999@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'lwfpyjkwbecoykwl',
  },
};

// Create reusable transporter
let transporter = null;
try {
  transporter = nodemailer.createTransport(SMTP_CONFIG);
  console.log('✓ Email service configured with Gmail SMTP');
} catch (error) {
  console.error('✗ Failed to configure email service:', error.message);
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP verification email
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} accountName - User's account name
 */
export async function sendVerificationEmail(email, otp, accountName) {
  if (!transporter) {
    console.warn('⚠ Email service not configured.');
    console.log(`📧 [DEV MODE] OTP for ${email}: ${otp}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"${SENDER_NAME || 'AICrawlData'}" <${SENDER_EMAIL || 'hoccode9999@gmail.com'}>`,
    to: email,
    subject: 'Verify Your Account - AICrawlData',
    text: `Hello ${accountName},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nAICrawlData Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .otp-box { background-color: #fff; border: 2px dashed #4CAF50; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${accountName}</strong>,</p>
            <p>Thank you for registering with AICrawlData! To complete your registration, please use the verification code below:</p>
            <div class="otp-box">${otp}</div>
            <p><strong>Important:</strong> This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>Best regards,<br>AICrawlData Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Verification email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('✗ Failed to send verification email:', error.message);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(email, accountName) {
  if (!transporter) {
    console.log(`📧 [DEV MODE] Welcome email for ${email}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"${SENDER_NAME || 'AICrawlData'}" <${SENDER_EMAIL || 'hoccode9999@gmail.com'}>`,
    to: email,
    subject: 'Welcome to AICrawlData!',
    text: `Hello ${accountName},\n\nWelcome to AICrawlData! Your account has been successfully verified.\n\nYou can now start using our AI-powered data crawling platform.\n\nBest regards,\nAICrawlData Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to AICrawlData!</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${accountName}</strong>,</p>
            <p>Your account has been successfully verified! You're all set to start using our AI-powered data crawling platform.</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>Chat with our AI to define your data crawling requirements</li>
              <li>Automatically crawl and extract data from websites</li>
              <li>Export data in various formats (CSV, JSON, Excel)</li>
              <li>Track and manage your crawling requests</li>
            </ul>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_HOST || 'http://localhost:3004'}" class="button">Get Started</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy crawling!<br>AICrawlData Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('✗ Failed to send welcome email:', error.message);
    // Don't throw error for welcome email - it's not critical
    return { success: false };
  }
}
