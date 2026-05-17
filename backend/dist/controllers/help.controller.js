import * as helpService from '../services/help.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
export const getFAQs = asyncHandler(async (req, res) => {
    const { category } = req.query;
    const faqs = await helpService.getFAQs(category);
    return res.status(200).json(new ApiResponse(200, faqs, 'FAQs fetched successfully'));
});
export const createTicket = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError(401, 'Unauthorized');
    const { subject, message } = req.body;
    if (!subject || !message)
        throw new ApiError(400, 'Subject and Message are required');
    const ticket = await helpService.createTicket(userId, subject, message);
    return res.status(201).json(new ApiResponse(201, ticket, 'Support ticket created successfully'));
});
export const listTicketsAdmin = asyncHandler(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const status = typeof req.query.status === 'string' && ['OPEN', 'IN_PROGRESS', 'CLOSED'].includes(req.query.status)
        ? req.query.status
        : undefined;
    const rows = await helpService.listTicketsForStaff(req.user, { search, status });
    const tickets = rows.map((t) => ({
        id: t.id,
        subject: t.subject,
        message: t.message,
        status: t.status,
        userId: t.userId,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        user: t.user,
    }));
    return res.status(200).json(new ApiResponse(200, { tickets }, 'Tickets fetched successfully'));
});
export const updateTicketAdmin = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { status, staffReply } = req.body;
    const updated = await helpService.updateTicketForStaff(id, req.user, {
        status,
        staffReply,
    });
    return res.status(200).json(new ApiResponse(200, {
        ticket: {
            id: updated.id,
            subject: updated.subject,
            message: updated.message,
            status: updated.status,
            userId: updated.userId,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
            user: updated.user,
        },
    }, 'Ticket updated successfully'));
});
export const createTicketAdmin = asyncHandler(async (req, res) => {
    const created = await helpService.createTicketForCustomerAsStaff(req.user, req.body);
    return res.status(201).json(new ApiResponse(201, {
        ticket: {
            id: created.id,
            subject: created.subject,
            message: created.message,
            status: created.status,
            userId: created.userId,
            createdAt: created.createdAt.toISOString(),
            updatedAt: created.updatedAt.toISOString(),
            user: created.user,
        },
    }, 'Support ticket created for customer'));
});
//# sourceMappingURL=help.controller.js.map