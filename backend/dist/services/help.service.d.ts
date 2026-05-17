import type { TicketStatus } from '@prisma/client';
export declare const STAFF_REPLY_START = "\n\n---STAFF---\n";
export declare const STAFF_REPLY_END = "\n---ENDSTAFF---\n";
type StaffUser = {
    id: string;
    role: string;
};
export declare const getFAQs: (category?: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    category: string | null;
    isActive: boolean;
    question: string;
    answer: string;
}[]>;
export declare const createTicket: (userId: string, subject: string, message: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.TicketStatus;
    userId: string;
    subject: string;
    message: string;
}>;
export declare function listTicketsForStaff(staff: StaffUser, opts?: {
    search?: string;
    status?: TicketStatus;
}): Promise<({
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.TicketStatus;
    userId: string;
    subject: string;
    message: string;
})[]>;
export declare function assertTicketAccessibleForStaff(ticketId: string, staff: StaffUser): Promise<{
    id: string;
    userId: string;
}>;
export declare function updateTicketForStaff(ticketId: string, staff: StaffUser, input: {
    status?: TicketStatus;
    staffReply?: string;
}): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.TicketStatus;
    userId: string;
    subject: string;
    message: string;
}>;
export declare function createTicketForCustomerAsStaff(staff: StaffUser, input: {
    customerLookup: string;
    subject: string;
    message: string;
    category?: string;
    priority?: string;
}): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.TicketStatus;
    userId: string;
    subject: string;
    message: string;
}>;
export {};
//# sourceMappingURL=help.service.d.ts.map