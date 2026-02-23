import React from 'react';
import {
    Container,
    Heading,
    Section,
    Text,
    Button,
} from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';

interface GeneralNotificationEmailProps {
    title: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
}

export const GeneralNotificationEmail: React.FC<GeneralNotificationEmailProps> = ({
    title,
    message,
    actionUrl,
    actionLabel = 'View Details',
}) => {
    return (
        <EmailLayout preview={title}>
            <Container>
                <Heading as="h1" style={h1}>
                    {title}
                </Heading>
                
                <Text style={text}>
                    {message}
                </Text>

                {actionUrl && (
                    <Section style={btnSection}>
                        <Button
                            style={{ ...button, padding: '12px 20px' }}
                            href={actionUrl}
                        >
                            {actionLabel}
                        </Button>
                    </Section>
                )}
                
                <Text style={footerText}>
                    Thank you for using ZimCart! Stay tuned for more updates.
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

const footerText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '32px 0 16px',
};

const btnSection = {
    margin: '24px 0',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#166534',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    lineHeight: '100%',
};

export default GeneralNotificationEmail;
