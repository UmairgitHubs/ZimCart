import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as inventoryService from '../services/inventory.service.js';
export const getInventory = asyncHandler(async (req, res) => {
    const page = parseInt(String(req.query.page || '1')) || 1;
    const limit = parseInt(String(req.query.limit || '10')) || 10;
    const { category, status, search, warehouse } = req.query;
    const data = await inventoryService.getInventory({
        page,
        limit,
        category: category,
        status: status,
        search: search,
        warehouse: warehouse,
        user: req.user
    });
    return res.status(200).json(new ApiResponse(200, data, "Inventory fetched successfully"));
});
export const updateStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { currentStock, reason } = req.body;
    const product = await inventoryService.updateStock(String(id), Number(currentStock), req.user, reason);
    return res.status(200).json(new ApiResponse(200, product, "Stock updated successfully"));
});
export const getHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const history = await inventoryService.getInventoryHistory(String(id));
    return res.status(200).json(new ApiResponse(200, history, "History fetched successfully"));
});
export const deleteInventory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await inventoryService.deleteInventory(String(id), req.user);
    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully from inventory"));
});
//# sourceMappingURL=inventory.controller.js.map