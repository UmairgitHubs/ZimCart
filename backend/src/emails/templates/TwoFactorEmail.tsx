import React from 'react';
import {
    Container,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';

interface TwoFactorEmailProps {
    otpCode: string;
    appName?: string;
}

export const TwoFactorEmail: React.FC<TwoFactorEmailProps> = ({
    otpCode,
    appName = 'ZimCart',
}) => {
    return (
        <EmailLayout preview="Your ZimCart Verification Code">
            <Container>
                <Heading as="h1" style={h1}>
                    Account Verification
                </Heading>
                
                <Text style={text}>
                    Hello,
                </Text>
                
                <Text style={text}>
                    To complete your login to {appName}, please use the following one-time password (OTP):
                </Text>

                <Section style={tokenContainer}>
                    <Text style={tokenText}>{otpCode}</Text>
                </Section>
                
                <Text style={text}>
                    This code will expire in 10 minutes. If you did not request this, please ensure your account password is secure.
                </Text>

                <Text style={subtext}>
                    For your security, never share this code with anyone. {appName} support will never ask for this code.
                </Text>
            </Container>
        </EmailLayout>
    );
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
    textAlign: 'center' as const,
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
