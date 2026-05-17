import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as storeService from '../services/store.service.js';
/**
 * @desc    Public mart discovery (active + OPEN or BUSY only; excludes CLOSED/HIDDEN).
 * @route   GET /api/v1/marts
 * @access  Public
 */
export const getStores = asyncHandler(async (req, res) => {
    const stores = await storeService.getAllMarts();
    return res.status(200).json(new ApiResponse(200, stores, "Marts fetched successfully"));
});
/**
 * @desc    All marts for admin pickers (includes inactive / CLOSED / HIDDEN).
 * @route   GET /api/v1/marts/admin/directory
 * @access  Private — ADMIN
 */
export const getMartsAdminDirectory = asyncHandler(async (_req, res) => {
    const rows = await storeService.getMartsDirectoryForAdmin();
    return res.status(200).json(new ApiResponse(200, rows, 'Marts directory fetched successfully'));
});
/**
 * @desc    Fetch detailed store hub (categories + products). Only OPEN/BUSY, active marts.
 * @route   GET /api/v1/marts/:id
 * @access  Public
 */
export const getStoreDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { q, category } = req.query;
    if (!id) {
        throw new ApiError(400, "Store ID is required");
    }
    const store = await storeService.getMartById(String(id), q ? String(q) : undefined, category ? String(category) : undefined);
    if (!store) {
        throw new ApiError(404, "Store not found");
    }
    return res.status(200).json(new ApiResponse(200, store, "Store details fetched successfully"));
});
export const getStoreSettings = asyncHandler(async (req, res) => {
    const queryStoreId = typeof req.query.storeId === 'string' ? req.query.storeId : undefined;
    const store = await storeService.getStoreSettingsForStaff(req.user, queryStoreId);
    return res.status(200).json(new ApiResponse(200, { store: serializeSettingsStore(store) }, 'Store settings fetched successfully'));
});
export const updateStoreSettings = asyncHandler(async (req, res) => {
    const body = req.body;
    const statusVal = body.status;
    const updated = await storeService.updateStoreSettingsForStaff(req.user, {
        storeId: typeof body.storeId === 'string' ? body.storeId : undefined,
        name: typeof body.name === 'string' ? body.name : undefined,
        description: body.description === undefined ? undefined : body.description,
        image: body.image === undefined ? undefined : body.image,
        deliveryTime: body.deliveryTime === undefined ? undefined : body.deliveryTime,
        minOrder: typeof body.minOrder === 'number' ? body.minOrder : undefined,
        deliveryFee: typeof body.deliveryFee === 'number' ? body.deliveryFee : undefined,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
        status: typeof statusVal === 'string' && ['OPEN', 'CLOSED', 'BUSY', 'HIDDEN'].includes(statusVal)
            ? statusVal
            : undefined,
        openingHours: body.openingHours,
    });
    return res.status(200).json(new ApiResponse(200, { store: serializeSettingsStore(updated) }, 'Store settings updated successfully'));
});
function serializeSettingsStore(store) {
    return {
        ...store,
        openingHours: store.openingHours ?? null,
    };
}
//# sourceMappingURL=store.controller.js.map