export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    isPremium: boolean;
    notifications?: {
        emailEnabled: boolean;
        smsEnabled: boolean;
        pushEnabled: boolean;
        promotionalEnabled: boolean;
    };
    preferences?: {
        email_notifications: boolean;
        sms_notifications: boolean;
        push_notifications: boolean;
        promotional_emails: boolean;
    };
    savedAddresses: Address[];
    paymentMethods: PaymentMethod[];
    _count?: {
        orders: number;
        vouchers: number;
        favourites: number;
    };
    isTwoFactorEnabled?: boolean;
    dataSharingConsent?: boolean;
}

export interface Address {
    id: string;
    label: string; // e.g. "Home", "Work"
    address: string; // Formatted address
    detail: string;
    instructions?: string;
    isDefault: boolean;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
    last4?: string;
    expiry?: string;
    brand?: string; // e.g. "Visa", "Mastercard"
    isDefault: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
