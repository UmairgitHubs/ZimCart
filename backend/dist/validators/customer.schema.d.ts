import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
        avatar: z.ZodOptional<z.ZodString>;
        isPremium: z.ZodOptional<z.ZodBoolean>;
        preferences: z.ZodOptional<z.ZodObject<{
            email_notifications: z.ZodOptional<z.ZodBoolean>;
            sms_notifications: z.ZodOptional<z.ZodBoolean>;
            push_notifications: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const getOrdersSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            active: "active";
            history: "history";
        }>>;
        page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
        limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const toggleFavouriteSchema: z.ZodObject<{
    params: z.ZodObject<{
        productId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getVouchersSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            active: "active";
            expired: "expired";
            used: "used";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const addAddressSchema: z.ZodObject<{
    body: z.ZodObject<{
        label: z.ZodString;
        address: z.ZodString;
        detail: z.ZodOptional<z.ZodString>;
        instructions: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodOptional<z.ZodBoolean>;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const updateAddressSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        instructions: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodOptional<z.ZodBoolean>;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const updateSecuritySchema: z.ZodObject<{
    body: z.ZodObject<{
        isTwoFactorEnabled: z.ZodOptional<z.ZodBoolean>;
        dataSharingConsent: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const deleteAccountSchema: z.ZodObject<{
    body: z.ZodObject<{
        password: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const addPaymentMethodSchema: z.ZodObject<{
    body: z.ZodObject<{
        type: z.ZodEnum<{
            CARD: "CARD";
            PAYPAL: "PAYPAL";
            APPLE_PAY: "APPLE_PAY";
            GOOGLE_PAY: "GOOGLE_PAY";
            CASH: "CASH";
        }>;
        brand: z.ZodOptional<z.ZodString>;
        last4: z.ZodOptional<z.ZodString>;
        expiry: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
}, z.core.$strip>;
//# sourceMappingURL=customer.schema.d.ts.map