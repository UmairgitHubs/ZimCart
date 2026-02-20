import React from 'react';
import {
    Container,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout.js';

interface DataExportEmailProps {
    userData: any;
    appName?: string;
}

export const DataExportEmail: React.FC<DataExportEmailProps> = ({
    userData,
    appName = 'ZimCart',
}) => {
    return (
        <EmailLayout preview="Your ZimCart Personal Data Export">
            <Container>
                <Heading as="h1" style={h1}>
                    Personal Data Export
                </Heading>
                
                <Text style={text}>
                    Hello {userData.name},
                </Text>
                
                <Text style={text}>
                    As requested, here is a summary of the data associated with your {appName} account. 
                    This export includes your profile details, addresses, and account status.
                </Text>

                <Section style={dataBox}>
                    <Text style={dataTitle}>Account Summary</Text>
                    <Text style={dataDetail}>Name: {userData.name}</Text>
                    <Text style={dataDetail}>Email: {userData.email}</Text>
                    <Text style={dataDetail}>Phone: {userData.phone || 'N/A'}</Text>
                    <Text style={dataDetail}>Member Since: {new Date(userData.createdAt).toLocaleDateString()}</Text>
                </Section>

                <Section style={dataBox}>
                    <Text style={dataTitle}>Security Settings</Text>
                    <Text style={dataDetail}>2FA Enabled: {userData.isTwoFactorEnabled ? 'Yes' : 'No'}</Text>
                    <Text style={dataDetail}>Data Sharing: {userData.dataSharingConsent ? 'Opted In' : 'Opted Out'}</Text>
                </Section>

                <Section style={dataBox}>
                    <Text style={dataTitle}>Addresses ({userData.addresses?.length || 0})</Text>
                    {userData.addresses?.map((addr: any, i: number) => (
                        <Text key={i} style={dataDetail}>• {addr.label}: {addr.address}</Text>
                    ))}
                </Section>

                <Text style={text}>
                    For your security, we have excluded sensitive information like your encrypted password and session tokens from this summary.
                </Text>

                <Text style={subtext}>
                    If you have any questions or would like to request a more detailed technical export (JSON format), please reply to this email or contact support.
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
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
};

const dataDetail = {
    fontSize: '14px',
    color: '#374151',
    margin: '4px 0',
};

export default DataExportEmail;
