import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').optional().or(z.literal('')),
  avatar: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
