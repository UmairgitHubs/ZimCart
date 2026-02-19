import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional(), // E.164-ish regex
    avatar: z.string().url("Avatar must be a valid URL").optional(),
    isPremium: z.boolean().optional(),
    preferences: z.object({
      email_notifications: z.boolean().optional(),
      sms_notifications: z.boolean().optional(),
      push_notifications: z.boolean().optional(),
    }).optional(),
  }).strict()
});

export const getOrdersSchema = z.object({
  query: z.object({
    status: z.enum(['active', 'history']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  })
});

export const toggleFavouriteSchema = z.object({
  params: z.object({
    productId: z.string().uuid("Invalid Product ID format"),
  })
});

export const getVouchersSchema = z.object({
  query: z.object({
    status: z.enum(['active', 'expired', 'used']).optional().default('active'),
  })
});
