import { z } from 'zod';
export declare const createVoucherSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        discountType: z.ZodEnum<{
            PERCENTAGE: "PERCENTAGE";
            FIXED: "FIXED";
        }>;
        value: z.ZodNumber;
        minSpend: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        maxDiscount: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        expiryDate: z.ZodString;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        storeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateVoucherSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        discountType: z.ZodOptional<z.ZodEnum<{
            PERCENTAGE: "PERCENTAGE";
            FIXED: "FIXED";
        }>>;
        value: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        maxDiscount: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        expiryDate: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        storeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const voucherIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=voucher.schema.d.ts.map