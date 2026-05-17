import { z } from 'zod';
export declare const updateAdminTicketSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            OPEN: "OPEN";
            IN_PROGRESS: "IN_PROGRESS";
            CLOSED: "CLOSED";
        }>>;
        staffReply: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createAdminTicketSchema: z.ZodObject<{
    body: z.ZodObject<{
        customerLookup: z.ZodString;
        subject: z.ZodString;
        message: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodEnum<{
            Medium: "Medium";
            Low: "Low";
            High: "High";
            Critical: "Critical";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=helpTicket.schema.d.ts.map