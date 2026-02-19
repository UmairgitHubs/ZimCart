import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  phone: z.string().regex(/^(\+?\d{10,15})$/, "Phone number must be valid (10-15 digits)").optional().or(z.literal('')),
  avatar: z.string().optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
