import { z } from 'zod';

export const updateAvailabilitySchema = z.object({
  body: z.object({
    availability: z.enum(['AVAILABLE', 'OFFLINE']),
  }),
});

export const updateJobStatusSchema = z.object({
  body: z.object({
    action: z.enum([
      'arrived_at_store',
      'picked_up',
      'out_for_delivery',
      'delivered',
      'failed_delivery',
    ]),
    note: z.string().max(500).optional(),
    proofOfDeliveryUrl: z.string().url().max(2048).optional(),
  }),
});

export const updateRiderProfileSchema = z.object({
  body: z.object({
    phone: z.string().min(5).max(40).optional(),
    name: z.string().min(1).max(120).optional(),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const pushTokenSchema = z.object({
  body: z.object({
    pushToken: z.string().min(1),
  }),
});

export const requestPayoutSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    method: z.string().min(2).max(32),
    accountRef: z.string().min(5).max(64),
    accountName: z.string().max(120).optional(),
    notes: z.string().max(300).optional(),
  }),
});
