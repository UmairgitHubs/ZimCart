import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<{
            CUSTOMER: "CUSTOMER";
            ADMIN: "ADMIN";
            STORE_MANAGER: "STORE_MANAGER";
            RIDER: "RIDER";
        }>>;
        avatar: z.ZodOptional<z.ZodString>;
        termsConsent: z.ZodBoolean;
        privacyConsent: z.ZodBoolean;
        deviceInfo: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
            os: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        deviceInfo: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
            os: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
        password: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=auth.schema.d.ts.map