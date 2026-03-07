import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().regex(/^(\+?\d{1,15})$/, "Invalid phone number format").or(z.literal('')).optional(),
    avatar: z.string().optional(), // Cloudinary ID or URL
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

// Address Schemas
export const addAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1, "Label is required"),
    address: z.string().min(5, "Address is required"),
    detail: z.string().optional(),
    instructions: z.string().optional(),
    isDefault: z.boolean().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).strict()
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Address ID"),
  }),
  body: z.object({
    label: z.string().optional(),
    address: z.string().optional(),
    detail: z.string().optional(),
    instructions: z.string().optional(),
    isDefault: z.boolean().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).strict()
});

// Security Schemas
export const updateSecuritySchema = z.object({
  body: z.object({
    isTwoFactorEnabled: z.boolean().optional(),
    dataSharingConsent: z.boolean().optional(),
  }).strict()
});

export const deleteAccountSchema = z.object({
  body: z.object({
    password: z.string().min(1, "Password is required for account deletion confirmation"),
  }).strict()
});

// Payment Methods Schemas
export const addPaymentMethodSchema = z.object({
  body: z.object({
    type: z.enum(['CARD', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY', 'CASH']),
    brand: z.string().optional(),
    last4: z.string().regex(/^\d{4}$/, "Must be 4 digits").optional(),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY").optional(),
    token: z.string().optional(),
    isDefault: z.boolean().optional(),
  }).strict()
});
