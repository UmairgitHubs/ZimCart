import * as helpService from '../services/help.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getFAQs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const faqs = await helpService.getFAQs(category as string);
  
  return res.status(200).json(
    new ApiResponse(200, faqs, 'FAQs fetched successfully')
  );
});

export const createTicket = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { subject, message } = req.body;
  if (!subject || !message) throw new ApiError(400, 'Subject and Message are required');

  const ticket = await helpService.createTicket(userId, subject, message);

  return res.status(201).json(
    new ApiResponse(201, ticket, 'Support ticket created successfully')
  );
});
