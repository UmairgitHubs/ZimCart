import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as wasteService from '../services/waste.service.js';
import type { WasteReason } from '@prisma/client';

export const listWasteLogs = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const result = await wasteService.listWasteLogs(user, {
    storeId: typeof req.query.storeId === 'string' ? req.query.storeId : undefined,
    reason: typeof req.query.reason === 'string' ? (req.query.reason as WasteReason) : undefined,
    search: typeof req.query.search === 'string' ? req.query.search : undefined,
    from: typeof req.query.from === 'string' ? req.query.from : undefined,
    to: typeof req.query.to === 'string' ? req.query.to : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  return res.status(200).json(new ApiResponse(200, result, 'Waste logs loaded'));
});

export const createWasteLog = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const log = await wasteService.createWasteLog(user, req.body);
  return res.status(201).json(new ApiResponse(201, { log }, 'Waste log created'));
});

export const updateWasteLog = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const id = req.params.id as string;
  const log = await wasteService.updateWasteLog(user, id, req.body);
  return res.status(200).json(new ApiResponse(200, { log }, 'Waste log updated'));
});

export const deleteWasteLog = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const id = req.params.id as string;
  const result = await wasteService.deleteWasteLog(user, id);
  return res.status(200).json(new ApiResponse(200, result, 'Waste log deleted'));
});
