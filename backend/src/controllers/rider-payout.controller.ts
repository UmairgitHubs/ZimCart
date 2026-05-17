import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as payoutService from '../services/rider-payout.service.js';

export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await payoutService.getRiderWallet(req.user!.id);
  return res.status(200).json(new ApiResponse(200, { wallet }, 'Wallet fetched'));
});

export const requestPayout = asyncHandler(async (req, res) => {
  const payout = await payoutService.requestRiderPayout(req.user!.id, req.body);
  return res.status(201).json(new ApiResponse(201, { payout }, 'Payout requested'));
});

export const listAdmin = asyncHandler(async (req, res) => {
  const status = (req.query.status as string) || 'All';
  const payouts = await payoutService.listPayoutsAdmin(status);
  return res.status(200).json(new ApiResponse(200, { payouts }, 'Payouts fetched'));
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const payout = await payoutService.updatePayoutStatusAdmin(
    req.params.id as string,
    status,
    adminNotes
  );
  return res.status(200).json(new ApiResponse(200, { payout }, 'Payout updated'));
});
