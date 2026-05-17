import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
export const STAFF_REPLY_START = '\n\n---STAFF---\n';
export const STAFF_REPLY_END = '\n---ENDSTAFF---\n';
async function getStaffManagedStoreId(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, managedStore: { select: { id: true } } },
    });
    if (!user)
        throw new ApiError(401, 'User not found');
    return user;
}
async function customerUserIdsForStore(storeId) {
    const rows = await prisma.order.findMany({
        where: { storeId },
        select: { userId: true },
        distinct: ['userId'],
    });
    return rows.map((r) => r.userId);
}
export const getFAQs = async (category) => {
    const where = { isActive: true };
    if (category) {
        where.category = category;
    }
    return prisma.fAQ.findMany({
        where,
        orderBy: { createdAt: 'asc' },
    });
};
export const createTicket = async (userId, subject, message) => {
    return prisma.supportTicket.create({
        data: {
            userId,
            subject,
            message,
            status: 'OPEN',
        },
    });
};
export async function listTicketsForStaff(staff, opts) {
    const ctx = await getStaffManagedStoreId(staff.id);
    if (ctx.role !== 'ADMIN' && ctx.role !== 'STORE_MANAGER') {
        throw new ApiError(403, 'Not authorized');
    }
    let userIdFilter;
    if (ctx.role === 'STORE_MANAGER') {
        const sid = ctx.managedStore?.id;
        if (!sid)
            return [];
        const ids = await customerUserIdsForStore(sid);
        userIdFilter = { in: ids.length ? ids : ['__none__'] };
    }
    const search = opts?.search?.trim();
    const parts = [];
    if (userIdFilter) {
        parts.push({ userId: userIdFilter });
    }
    if (opts?.status) {
        parts.push({ status: opts.status });
    }
    if (search) {
        parts.push({
            OR: [
                { subject: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
        });
    }
    const where = parts.length ? { AND: parts } : {};
    return prisma.supportTicket.findMany({
        where,
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });
}
export async function assertTicketAccessibleForStaff(ticketId, staff) {
    const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        select: { id: true, userId: true },
    });
    if (!ticket)
        throw new ApiError(404, 'Ticket not found');
    const ctx = await getStaffManagedStoreId(staff.id);
    if (ctx.role === 'ADMIN')
        return ticket;
    if (ctx.role === 'STORE_MANAGER') {
        const sid = ctx.managedStore?.id;
        if (!sid)
            throw new ApiError(403, 'No managed store');
        const ids = await customerUserIdsForStore(sid);
        if (ids.includes(ticket.userId))
            return ticket;
        throw new ApiError(403, 'You cannot access this ticket');
    }
    throw new ApiError(403, 'Not authorized');
}
function appendStaffToMessage(message, reply) {
    return `${message}${STAFF_REPLY_START}${reply.trim()}${STAFF_REPLY_END}`;
}
export async function updateTicketForStaff(ticketId, staff, input) {
    await assertTicketAccessibleForStaff(ticketId, staff);
    const existing = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!existing)
        throw new ApiError(404, 'Ticket not found');
    let message = existing.message;
    if (input.staffReply) {
        message = appendStaffToMessage(message, input.staffReply);
    }
    return prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.staffReply !== undefined ? { message } : {}),
        },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
        },
    });
}
export async function createTicketForCustomerAsStaff(staff, input) {
    const ctx = await getStaffManagedStoreId(staff.id);
    if (ctx.role !== 'ADMIN' && ctx.role !== 'STORE_MANAGER') {
        throw new ApiError(403, 'Not authorized');
    }
    const raw = input.customerLookup.trim();
    const user = (await prisma.user.findFirst({
        where: { email: { equals: raw, mode: 'insensitive' } },
        select: { id: true, role: true },
    })) ||
        (await prisma.user.findUnique({
            where: { id: raw },
            select: { id: true, role: true },
        }));
    if (!user)
        throw new ApiError(404, 'Customer not found');
    if (user.role !== 'CUSTOMER') {
        throw new ApiError(400, 'Tickets can only be created for customer accounts');
    }
    if (ctx.role === 'STORE_MANAGER') {
        const sid = ctx.managedStore?.id;
        if (!sid)
            throw new ApiError(403, 'No managed store');
        const ids = await customerUserIdsForStore(sid);
        if (!ids.includes(user.id)) {
            throw new ApiError(403, 'Customer has no orders for your store');
        }
    }
    const cat = input.category?.trim() || 'Technical';
    const subject = `[${cat}] ${input.subject.trim()}`;
    const pri = input.priority || 'Medium';
    const body = `[P:${pri}]\n\n${input.message.trim()}`;
    return prisma.supportTicket.create({
        data: {
            userId: user.id,
            subject,
            message: body,
            status: 'OPEN',
        },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
        },
    });
}
//# sourceMappingURL=help.service.js.map