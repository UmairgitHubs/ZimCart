import { z } from 'zod';
const discountTypeEnum = z.enum(['PERCENTAGE', 'FIXED']);
export const createVoucherSchema = z.object({
    body: z.object({
        code: z.string().min(1).max(64),
        name: z.string().min(1).max(120),
        description: z.string().max(2000).optional(),
        discountType: discountTypeEnum,
        value: z.number().positive(),
        minSpend: z.number().nonnegative().optional().nullable(),
        maxDiscount: z.number().nonnegative().optional().nullable(),
        expiryDate: z.string().datetime({ offset: true }),
        isActive: z.boolean().optional().default(true),
        storeId: z.string().uuid().optional().nullable(),
    }),
});
export const updateVoucherSchema = z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z
        .object({
        code: z.string().min(1).max(64).optional(),
        name: z.string().min(1).max(120).optional(),
        description: z.string().max(2000).optional().nullable(),
        discountType: discountTypeEnum.optional(),
        value: z.number().positive().optional(),
        minSpend: z.number().nonnegative().optional().nullable(),
        maxDiscount: z.number().nonnegative().optional().nullable(),
        expiryDate: z.string().datetime({ offset: true }).optional(),
        isActive: z.boolean().optional(),
        storeId: z.string().uuid().optional().nullable(),
    })
        .refine((b) => Object.keys(b).length > 0, { message: 'At least one field is required' }),
});
export const voucherIdParamSchema = z.object({
    params: z.object({ id: z.string().uuid() }),
});
//# sourceMappingURL=voucher.schema.js.map