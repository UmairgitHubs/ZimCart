import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Html, Head, Body, Container, Preview, Section, Text, } from '@react-email/components';
export const EmailLayout = ({ children, preview }) => {
    return (_jsxs(Html, { children: [_jsx(Head, {}), _jsx(Preview, { children: preview || 'ZimCart Notification' }), _jsx(Body, { style: main, children: _jsxs(Container, { style: container, children: [_jsx(Section, { style: header, children: _jsx(Text, { style: logoText, children: "ZimCart" }) }), _jsx(Section, { style: content, children: children }), _jsxs(Section, { style: footer, children: [_jsxs(Text, { style: footerText, children: ["\u00A9 ", new Date().getFullYear(), " ZimCart. All rights reserved."] }), _jsx(Text, { style: footerText, children: "123 Commerce St, Market City" })] })] }) })] }));
};
// Styles
const main = {
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
};
const header = {
    backgroundColor: '#ffffff',
    padding: '24px',
    textAlign: 'center',
    borderBottom: '3px solid #166534',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};
const logoText = {
    color: '#166534',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};
const content = {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
};
const footer = {
    padding: '24px',
    textAlign: 'center',
};
const footerText = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0',
    lineHeight: '1.5',
};
//# sourceMappingURL=EmailLayout.js.map