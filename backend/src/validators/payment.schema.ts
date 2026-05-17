import { z } from 'zod';

const uiStatus = z.enum(['Completed', 'Pending', 'Failed', 'Refunded']);

export const listPaymentsSchema = z.object({
  query: z.object({
    status: z.union([uiStatus, z.literal('All')]).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const paymentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid payment id'),
  }),
});

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid payment id'),
  }),
  body: z
    .object({
      status: uiStatus,
      adminNotes: z.string().max(500).optional(),
    })
    .strict(),
});

export const reconcilePaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid payment id'),
  }),
  body: z
    .object({
      adminNotes: z.string().max(500).optional(),
    })
    .strict(),
});
