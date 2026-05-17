export declare const createSession: (userId: string, deviceInfo: any) => Promise<{
    id: string;
    createdAt: Date;
    pushToken: string | null;
    userId: string;
    deviceName: string;
    deviceType: string;
    os: string;
    ipAddress: string | null;
    lastActive: Date;
    isCurrent: boolean;
}>;
export declare const loginWithTokens: (user: any, deviceInfo: any) => Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
}>;
export declare const register: (data: any, deviceInfo?: any) => Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        isPremium: boolean;
        country: string | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const login: (data: any, deviceInfo?: any) => Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
} | {
    mfaRequired: boolean;
    mfaToken: string;
    email: string;
}>;
export declare const verify2FA: (mfaToken: string, code: string, deviceInfo?: any) => Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        isPremium: boolean;
        country: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        isTwoFactorEnabled: boolean;
        termsConsent: boolean;
        privacyConsent: boolean;
        dataSharingConsent: boolean;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        pushToken: string | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const resend2FA: (mfaToken: string) => Promise<{
    message: string;
}>;
export declare const refreshTokens: (token: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const logout: (userId: string, sessionId?: string) => Promise<{
    message: string;
}>;
export declare const forgotPassword: (email: string) => Promise<{
    message: string;
}>;
export declare const verifyResetCode: (email: string, code: string) => Promise<{
    token: string;
    message: string;
}>;
export declare const resetPassword: (token: string, password: string) => Promise<{
    message: string;
}>;
export declare const changePassword: (userId: string, data: any) => Promise<{
    message: string;
}>;
export declare const getUserById: (id: string) => Promise<{
    name: string;
    id: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    isPremium: boolean;
    country: string | null;
    status: import("@prisma/client").$Enums.UserStatus;
    isTwoFactorEnabled: boolean;
    termsConsent: boolean;
    privacyConsent: boolean;
    dataSharingConsent: boolean;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    pushToken: string | null;
} | null>;
//# sourceMappingURL=auth.service.d.ts.map