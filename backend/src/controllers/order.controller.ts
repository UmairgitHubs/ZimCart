import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as orderService from '../services/order.service.js';

export const getAllOrders = asyncHandler(async (req, res) => {
    // Basic filter extraction
    const query = req.query;
    const orders = await orderService.getAllOrders(query, req.user);

    return res.status(200).json(
        new ApiResponse(200, { orders }, "Orders fetched successfully")
    );
});

export const getOrderStats = asyncHandler(async (req, res) => {
    const stats = await orderService.getOrderStats(req.user);
    return res.status(200).json(new ApiResponse(200, stats, "Stats fetched successfully"));
});

export const createManualOrder = asyncHandler(async (req, res) => {
    const orderData = req.body;
    const newOrder = await orderService.createManualOrder(orderData, req.user);

    return res.status(201).json(
        new ApiResponse(201, { order: newOrder }, "Order created successfully")
    );
});

export const updateOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const orderData = req.body;
    const updatedOrder = await orderService.updateOrder(orderId as string, orderData, req.user);

    return res.status(200).json(
        new ApiResponse(200, { order: updatedOrder }, "Order updated successfully")
    );
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status || typeof status !== 'string') {
        return res.status(400).json(new ApiResponse(400, null, "Status is required"));
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId as string, status, req.user);
    
    return res.status(200).json(
        new ApiResponse(200, { order: updatedOrder }, "Order status updated successfully")
    );
});

export const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json(new ApiResponse(400, null, "Order ID is required"));
    }

    await orderService.deleteOrder(orderId as string, req.user);

    return res.status(200).json(
        new ApiResponse(200, null, "Order deleted successfully")
    );
});
