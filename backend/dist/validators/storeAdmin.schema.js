import { z } from 'zod';
const storeStatusEnum = z.enum(['OPEN', 'CLOSED', 'BUSY', 'HIDDEN']);
export const updateStoreSettingsSchema = z.object({
    body: z
        .object({
        storeId: z.string().uuid().optional(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(8000).optional().nullable(),
        image: z.string().max(2000).optional().nullable(),
        deliveryTime: z.string().max(120).optional().nullable(),
        minOrder: z.number().nonnegative().optional(),
        deliveryFee: z.number().nonnegative().optional(),
        isActive: z.boolean().optional(),
        status: storeStatusEnum.optional(),
        openingHours: z.any().optional(),
    })
        .refine((b) => Object.keys(b).filter((k) => k !== 'storeId').length > 0, { message: 'At least one updatable field is required (besides storeId for admin)' }),
});
//# sourceMappingURL=storeAdmin.schema.js.map