import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as analyticsService from '../services/analytics.service.js';

export const getOverview = asyncHandler(async (req, res) => {
  const queryStoreId = typeof req.query.storeId === 'string' ? req.query.storeId : undefined;
  const data = await analyticsService.getStaffOverview(req.user!, queryStoreId);
  return res.status(200).json(new ApiResponse(200, data, 'Overview metrics loaded'));
});

export const getInsights = asyncHandler(async (req, res) => {
  const range = typeof req.query.range === 'string' ? req.query.range : 'ytd';
  const queryStoreId = typeof req.query.storeId === 'string' ? req.query.storeId : undefined;
  const data = await analyticsService.getStaffInsights(req.user!, {
    range,
    ...(queryStoreId !== undefined ? { queryStoreId } : {}),
  });
  return res.status(200).json(new ApiResponse(200, data, 'Analytics insights loaded'));
});
