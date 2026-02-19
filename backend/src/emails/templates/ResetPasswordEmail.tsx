import React from 'react';
import {
    Html,
    Button,
    Container,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';

interface ResetPasswordEmailProps {
    resetToken: string;
    resetUrl: string;
    appName?: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
    resetToken,
    resetUrl,
    appName = 'ZimCart',
}) => {
    return (
        <EmailLayout preview="Reset your ZimCart password">
            <Container>
                <Heading as="h1" style={h1}>
                    Password Reset Request
                </Heading>
                
                <Text style={text}>
                    Hello,
                </Text>
                
                <Text style={text}>
                    We received a request to reset your password for your {appName} account. 
                    If you didn't make this request, you can safely ignore this email.
                </Text>

                <Section style={tokenContainer}>
                    <Text style={tokenText}>{resetToken}</Text>
                </Section>

                <Section style={buttonContainer}>
                    <Button
                        style={button}
                        href={resetUrl}
                    >
                        Reset Password
                    </Button>
                </Section>
                
                <Text style={text}>
                    If the button doesn't work, you can copy the token above into the app manually.
                    This link will expire in 10 minutes.
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

const tokenContainer = {
    backgroundColor: '#f0fdf4',
    borderRadius: '4px',
    border: '1px dashed #166534',
    margin: '24px 0',
    padding: '12px',
    textAlign: 'center' as const,
};

const tokenText = {
    color: '#166534',
    fontFamily: 'monospace',
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    margin: '0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0 32px 0',
};

const button = {
    backgroundColor: '#166534',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    padding: '12px 24px',
    display: 'inline-block',
};

export default ResetPasswordEmail;
