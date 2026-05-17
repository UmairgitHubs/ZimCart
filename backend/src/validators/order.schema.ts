import { z } from 'zod';

export const assignRiderSchema = z.object({
  body: z.object({
    riderId: z.string().uuid('Invalid rider id'),
  }),
});
