import nodemailer from 'nodemailer';
import { ApiError } from '../utils/ApiError.js';
import { render } from '@react-email/render';
import React from 'react';
import ResetPasswordEmail from '../emails/templates/ResetPasswordEmail.js';
import TwoFactorEmail from '../emails/templates/TwoFactorEmail.js';
import DataExportEmail from '../emails/templates/DataExportEmail.js';

const createTransporter = () => {
    // Check if configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn("⚠️ SMTP Configuration missing. Emails will not be sent.");
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
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
            from: `"${process.env.FROM_NAME || 'ZimCart Team'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
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

export const sendTwoFactorEmail = async (to: string, otpCode: string) => {
    const subject = "Your ZimCart Verification Code";

    const Component = (TwoFactorEmail as any).default || TwoFactorEmail;

    const emailHtml = await render(
        React.createElement(Component, {
            otpCode,
        })
    );

    return sendEmail(to, subject, emailHtml);
};

export const sendDataExportEmail = async (to: string, userData: any) => {
    const subject = "Your ZimCart Personal Data Export";

    const Component = (DataExportEmail as any).default || DataExportEmail;

    const emailHtml = await render(
        React.createElement(Component, {
            userData,
        })
    );

    return sendEmail(to, subject, emailHtml);
};

export const sendPasswordResetEmail = async (to: string, resetCode: string) => {
    const subject = "Reset Your Password - ZimCart";
    const resetUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Fallback for button if they use web

    // Use default export if it's an ESM module
    const Component = (ResetPasswordEmail as any).default || ResetPasswordEmail;

    const emailHtml = await render(
        React.createElement(Component, {
            resetToken: resetCode,
            resetUrl,
        })
    );

    return sendEmail(to, subject, emailHtml);
};
