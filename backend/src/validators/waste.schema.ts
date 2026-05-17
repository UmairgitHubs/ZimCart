import { z } from 'zod';

const wasteReason = z.enum(['EXPIRED', 'DAMAGED', 'LEAKED', 'SPOILAGE', 'LOST']);

export const createWasteLogSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    reason: wasteReason,
    notes: z.string().max(500).optional(),
    imageUrl: z.string().max(2048).optional(),
    unitCost: z.number().positive().optional(),
  }),
});

export const updateWasteLogSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive().optional(),
    reason: wasteReason.optional(),
    notes: z.string().max(500).optional(),
    imageUrl: z.string().url().max(2048).nullable().optional(),
    unitCost: z.number().positive().optional(),
  }),
});

export const listWasteLogsSchema = z.object({
  query: z.object({
    storeId: z.string().uuid().optional(),
    reason: wasteReason.optional(),
    search: z.string().max(120).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});
