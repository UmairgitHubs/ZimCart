import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as dispatchService from '../services/dispatch.service.js';

export const autoDispatch = asyncHandler(async (req, res) => {
  const result = await dispatchService.autoDispatchOrder(req.params.orderId as string, req.user!);
  return res.status(200).json(new ApiResponse(200, result, 'Rider auto-assigned successfully'));
});

export const getLiveMap = asyncHandler(async (req, res) => {
  const riders = await dispatchService.getFleetLiveLocations();
  return res.status(200).json(new ApiResponse(200, { riders }, 'Fleet locations fetched'));
});

export const getDispatchCandidates = asyncHandler(async (req, res) => {
  const candidates = await dispatchService.getDispatchCandidates(
    req.params.orderId as string,
    req.user!
  );
  return res.status(200).json(new ApiResponse(200, { candidates }, 'Dispatch candidates fetched'));
});
