import * as cartService from '../services/cart.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError(401, 'Unauthorized');
    const cart = await cartService.getCart(userId);
    return res.status(200).json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});
export const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError(401, 'Unauthorized');
    const { productId, quantity, variants } = req.body;
    if (!productId)
        throw new ApiError(400, 'Product ID is required');
    const cartItem = await cartService.addToCart(userId, productId, quantity || 1, variants);
    return res.status(200).json(new ApiResponse(200, cartItem, 'Item added to cart'));
});
export const updateCartItem = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const id = req.params.id; // Added explicit ID extraction
    const { quantity } = req.body;
    if (!userId)
        throw new ApiError(401, 'Unauthorized');
    if (!id)
        throw new ApiError(400, 'Item ID is required');
    const result = await cartService.updateCartItem(userId, String(id), Number(quantity));
    return res.status(200).json(new ApiResponse(200, result, 'Cart updated successfully'));
});
export const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const id = req.params.id;
    if (!userId)
        throw new ApiError(401, 'Unauthorized');
    if (!id)
        throw new ApiError(400, 'Item ID is required');
    await cartService.removeFromCart(userId, String(id));
    return res.status(200).json(new ApiResponse(200, {}, 'Item removed from cart'));
});
export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError(401, 'Unauthorized');
    await cartService.clearCart(userId);
    return res.status(200).json(new ApiResponse(200, {}, 'Cart cleared successfully'));
});
//# sourceMappingURL=cart.controller.js.map