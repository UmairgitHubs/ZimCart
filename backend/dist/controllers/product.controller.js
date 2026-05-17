import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as productService from '../services/product.service.js';
export const createProduct = asyncHandler(async (req, res) => {
    const { name, brand, description, images, price, discountPrice, costPrice, taxPercentage, sku, barcode, category, subCategory, inventory, status, isDeal, discountPercentage, weight, baseUnit, sales, variants } = req.body;
    const product = await productService.createProduct({
        name, brand, description, images, price, discountPrice,
        costPrice, taxPercentage, sku, barcode, category,
        subCategory, inventory, status, isDeal, discountPercentage,
        weight, baseUnit, sales, variants
    }, req.user?.id);
    if (!product) {
        throw new ApiError(500, "Failed to create product");
    }
    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, brand, description, images, price, discountPrice, costPrice, taxPercentage, sku, barcode, category, subCategory, inventory, status, isDeal, discountPercentage, weight, baseUnit, sales, variants } = req.body;
    const product = await productService.updateProduct(id, {
        name, brand, description, images, price, discountPrice,
        costPrice, taxPercentage, sku, barcode, category,
        subCategory, inventory, status, isDeal, discountPercentage,
        weight, baseUnit, sales, variants
    }, req.user?.id);
    if (!product) {
        throw new ApiError(404, "Product not found or update failed");
    }
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});
function isStaffCatalogRole(role) {
    return role === 'ADMIN' || role === 'STORE_MANAGER';
}
export const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(String(req.query.page || '1')) || 1;
    const limit = parseInt(String(req.query.limit || '20')) || 20;
    const { search, category, categoryId, status, isDeal, storeId } = req.query;
    const staff = isStaffCatalogRole(req.user?.role);
    const filters = {
        marketplaceMode: !staff,
    };
    if (search)
        filters.search = search;
    if (category)
        filters.category = category;
    if (categoryId)
        filters.categoryId = categoryId;
    if (status)
        filters.status = status;
    if (storeId)
        filters.storeId = storeId;
    if (staff && req.user?.id)
        filters.managerId = req.user.id;
    if (isDeal === 'true')
        filters.isDeal = true;
    const data = await productService.getProducts(page, limit, filters);
    return res.status(200).json(new ApiResponse(200, {
        products: data.products,
        pagination: data.pagination
    }, "Products fetched successfully"));
});
export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const staff = isStaffCatalogRole(req.user?.role);
    const product = await productService.getProductById(id, { marketplaceMode: !staff });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id, req.user?.id);
    return res.status(200).json(new ApiResponse(200, null, "Product purged successfully from the network"));
});
//# sourceMappingURL=product.controller.js.map