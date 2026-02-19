import React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface LayoutProps {
    children: React.ReactNode;
    preview?: string;
}

export const EmailLayout: React.FC<LayoutProps> = ({ children, preview }) => {
    return (
        <Html>
            <Head />
            <Preview>{preview || 'ZimCart Notification'}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text style={logoText}>ZimCart</Text>
                    </Section>

                    {/* Content */}
                    <Section style={content}>
                        {children}
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} ZimCart. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            123 Commerce St, Market City
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
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
    textAlign: 'center' as const,
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
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0',
    lineHeight: '1.5',
};
