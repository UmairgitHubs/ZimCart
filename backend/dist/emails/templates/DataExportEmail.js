import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Container, Heading, Section, Text, } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';
export const DataExportEmail = ({ userData, appName = 'ZimCart', }) => {
    return (_jsx(EmailLayout, { preview: "Your ZimCart Personal Data Export", children: _jsxs(Container, { children: [_jsx(Heading, { as: "h1", style: h1, children: "Personal Data Export" }), _jsxs(Text, { style: text, children: ["Hello ", userData.name, ","] }), _jsxs(Text, { style: text, children: ["As requested, here is a summary of the data associated with your ", appName, " account. This export includes your profile details, addresses, and account status."] }), _jsxs(Section, { style: dataBox, children: [_jsx(Text, { style: dataTitle, children: "Account Summary" }), _jsxs(Text, { style: dataDetail, children: ["Name: ", userData.name] }), _jsxs(Text, { style: dataDetail, children: ["Email: ", userData.email] }), _jsxs(Text, { style: dataDetail, children: ["Phone: ", userData.phone || 'N/A'] }), _jsxs(Text, { style: dataDetail, children: ["Member Since: ", new Date(userData.createdAt).toLocaleDateString()] })] }), _jsxs(Section, { style: dataBox, children: [_jsx(Text, { style: dataTitle, children: "Security Settings" }), _jsxs(Text, { style: dataDetail, children: ["2FA Enabled: ", userData.isTwoFactorEnabled ? 'Yes' : 'No'] }), _jsxs(Text, { style: dataDetail, children: ["Data Sharing: ", userData.dataSharingConsent ? 'Opted In' : 'Opted Out'] })] }), _jsxs(Section, { style: dataBox, children: [_jsxs(Text, { style: dataTitle, children: ["Addresses (", userData.addresses?.length || 0, ")"] }), userData.addresses?.map((addr, i) => (_jsxs(Text, { style: dataDetail, children: ["\u2022 ", addr.label, ": ", addr.address] }, i)))] }), _jsx(Text, { style: text, children: "For your security, we have excluded sensitive information like your encrypted password and session tokens from this summary." }), _jsx(Text, { style: subtext, children: "If you have any questions or would like to request a more detailed technical export (JSON format), please reply to this email or contact support." })] }) }));
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
    fontSize: '12px',
    lineHeight: '18px',
    margin: '16px 0',
};
const dataBox = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    border: '1px solid #e5e7eb',
};
const dataTitle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
};
const dataDetail = {
    fontSize: '14px',
    color: '#374151',
    margin: '4px 0',
};
export default DataExportEmail;
//# sourceMappingURL=DataExportEmail.js.map