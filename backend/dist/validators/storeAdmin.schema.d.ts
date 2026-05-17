import { z } from 'zod';
export declare const updateStoreSettingsSchema: z.ZodObject<{
    body: z.ZodObject<{
        storeId: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        deliveryTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        minOrder: z.ZodOptional<z.ZodNumber>;
        deliveryFee: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        status: z.ZodOptional<z.ZodEnum<{
            OPEN: "OPEN";
            CLOSED: "CLOSED";
            BUSY: "BUSY";
            HIDDEN: "HIDDEN";
        }>>;
        openingHours: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=storeAdmin.schema.d.ts.map