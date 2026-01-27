// utils/email.ts
import nodemailer from 'nodemailer';
import { config } from '../config/env';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });

  // Define email options
  const mailOptions = {
    from: `Padmasambhava Trips <${config.emailFrom}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// Email templates
export const emailTemplates = {
  welcome: (name: string) => `
    <h1>Welcome to Padmasambhava Trips, ${name}!</h1>
    <p>Thank you for joining us. We're excited to have you on board.</p>
    <p>Start exploring our amazing trip packages and plan your next adventure!</p>
  `,

  bookingConfirmation: (name: string, tripName: string, bookingId: string) => `
    <h1>Booking Confirmed!</h1>
    <p>Dear ${name},</p>
    <p>Your booking for <strong>${tripName}</strong> has been confirmed.</p>
    <p>Booking ID: <strong>${bookingId}</strong></p>
    <p>We'll send you more details shortly. Have a great trip!</p>
  `,

  passwordReset: (name: string, resetURL: string) => `
    <h1>Password Reset Request</h1>
    <p>Dear ${name},</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link is valid for 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,

  applicationStatus: (name: string, status: string, destination: string) => `
    <h1>Visa Application Update</h1>
    <p>Dear ${name},</p>
    <p>Your visa application for <strong>${destination}</strong> has been <strong>${status}</strong>.</p>
    <p>Check your dashboard for more details.</p>
  `,
};