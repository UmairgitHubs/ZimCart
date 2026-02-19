import nodemailer from 'nodemailer';
import { ApiError } from '../utils/ApiError.js';
import { render } from '@react-email/render';
import React from 'react';
import ResetPasswordEmail from '../emails/templates/ResetPasswordEmail.js'; // Ensure extension matches or is handled by resolver

const createTransporter = () => {
    // Check if configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("⚠️ SMTP Configuration missing. Emails will not be sent.");
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`\n[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
        console.log(`Body: ${html.substring(0, 100)}...`); 
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME || 'ZimCart Team'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`Message sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new ApiError(500, "Failed to send email. Please try again later.");
    }
};

export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
    const resetUrl = `zimcart://reset-password/${resetToken}`; 
    const subject = "Reset Your Password - ZimCart";

    // Use default export if it's an ESM module
    const Component = (ResetPasswordEmail as any).default || ResetPasswordEmail;

    const emailHtml = await render(
        React.createElement(Component, {
            resetToken,
            resetUrl,
        })
    );

    return sendEmail(to, subject, emailHtml);
};
