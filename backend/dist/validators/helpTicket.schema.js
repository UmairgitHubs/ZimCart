import { z } from 'zod';
const ticketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']);
export const updateAdminTicketSchema = z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z
        .object({
        status: ticketStatusEnum.optional(),
        staffReply: z.string().min(1).max(10000).optional(),
    })
        .refine((b) => b.status !== undefined || b.staffReply !== undefined, {
        message: 'Provide status and/or staffReply',
    }),
});
export const createAdminTicketSchema = z.object({
    body: z.object({
        customerLookup: z.string().min(1).max(320),
        subject: z.string().min(1).max(200),
        message: z.string().min(1).max(10000),
        category: z.string().max(64).optional(),
        priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    }),
});
//# sourceMappingURL=helpTicket.schema.js.map