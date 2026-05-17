import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Container, Heading, Section, Text, } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';
export const TwoFactorEmail = ({ otpCode, appName = 'ZimCart', }) => {
    return (_jsx(EmailLayout, { preview: "Your ZimCart Verification Code", children: _jsxs(Container, { children: [_jsx(Heading, { as: "h1", style: h1, children: "Account Verification" }), _jsx(Text, { style: text, children: "Hello," }), _jsxs(Text, { style: text, children: ["To complete your login to ", appName, ", please use the following one-time password (OTP):"] }), _jsx(Section, { style: tokenContainer, children: _jsx(Text, { style: tokenText, children: otpCode }) }), _jsx(Text, { style: text, children: "This code will expire in 10 minutes. If you did not request this, please ensure your account password is secure." }), _jsxs(Text, { style: subtext, children: ["For your security, never share this code with anyone. ", appName, " support will never ask for this code."] })] }) }));
};
// Styles
const h1 = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '30px 0',
    padding: '0',
    lineHeight: '1.25',
};
const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
};
const subtext = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '16px 0',
    fontStyle: 'italic',
};
const tokenContainer = {
    backgroundColor: '#f0fdf4',
    borderRadius: '4px',
    border: '1px dashed #166534',
    margin: '24px 0',
    padding: '24px',
    textAlign: 'center',
};
const tokenText = {
    color: '#166534',
    fontFamily: 'monospace',
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    margin: '0',
};
export default TwoFactorEmail;
//# sourceMappingURL=TwoFactorEmail.js.map