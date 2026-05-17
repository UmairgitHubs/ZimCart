import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Container, Heading, Section, Text, Button, } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';
export const GeneralNotificationEmail = ({ title, message, actionUrl, actionLabel = 'View Details', }) => {
    return (_jsx(EmailLayout, { preview: title, children: _jsxs(Container, { children: [_jsx(Heading, { as: "h1", style: h1, children: title }), _jsx(Text, { style: text, children: message }), actionUrl && (_jsx(Section, { style: btnSection, children: _jsx(Button, { style: { ...button, padding: '12px 20px' }, href: actionUrl, children: actionLabel }) })), _jsx(Text, { style: footerText, children: "Thank you for using ZimCart! Stay tuned for more updates." })] }) }));
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
const footerText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '32px 0 16px',
};
const btnSection = {
    margin: '24px 0',
    textAlign: 'center',
};
const button = {
    backgroundColor: '#166534',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    lineHeight: '100%',
};
export default GeneralNotificationEmail;
//# sourceMappingURL=GeneralNotificationEmail.js.map