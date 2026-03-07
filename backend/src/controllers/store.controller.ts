import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as storeService from '../services/store.service.js';

/**
 * @desc    Fetch all active marts for discovery
 * @route   GET /api/v1/marts
 * @access  Public
 */
export const getStores = asyncHandler(async (req, res) => {
  const stores = await storeService.getAllMarts();

  return res.status(200).json(
    new ApiResponse(200, stores, "Marts fetched successfully")
  );
});

/**
 * @desc    Fetch detailed store hub (categories + products)
 * @route   GET /api/v1/marts/:id
 * @access  Public
 */
export const getStoreDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { q, category } = req.query;

  if (!id) {
    throw new ApiError(400, "Store ID is required");
  }

  const store = await storeService.getMartById(
    String(id), 
    q ? String(q) : undefined, 
    category ? String(category) : undefined
  );
  
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  return res.status(200).json(
    new ApiResponse(200, store, "Store details fetched successfully")
  );
});
