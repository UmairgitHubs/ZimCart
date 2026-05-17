import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as paymentService from '../services/payment.service.js';

export const listPayments = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const result = await paymentService.listPayments(user, {
    status: req.query.status as string | undefined,
    search: req.query.search as string | undefined,
    page: req.query.page as unknown as number | undefined,
    limit: req.query.limit as unknown as number | undefined,
  });

  return res.status(200).json(new ApiResponse(200, result, 'Payments fetched'));
});

export const reconcilePayment = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const payment = await paymentService.reconcilePayment(
    req.params.id as string,
    user,
    req.body?.adminNotes
  );

  return res.status(200).json(new ApiResponse(200, { payment }, 'Payment reconciled'));
});

export const updatePayment = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const payment = await paymentService.updatePaymentStatus(req.params.id as string, user, req.body);

  return res.status(200).json(new ApiResponse(200, { payment }, 'Payment updated'));
});

export const deletePayment = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  await paymentService.deletePaymentAndOrder(req.params.id as string, user);

  return res.status(200).json(new ApiResponse(200, null, 'Payment and order removed'));
});
