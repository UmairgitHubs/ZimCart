import type { Request, Response } from 'express';
import { customerService } from '../services/customer.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// const customerService is already exported as instance, imported above.
// But wait, the file exported class CustomerService and const customerService.
// Let's check imports.

export class CustomerController {
  /*
   * Get Current User Profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    // Assuming auth middleware populates req.user
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const profile = await customerService.getProfile(userId);
    
    return res.status(200).json(
      new ApiResponse(200, profile, 'User profile fetched successfully')
    );
  });

  /*
   * Update Profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const updatedProfile = await customerService.updateProfile(userId, req.body);
    
    return res.status(200).json(
      new ApiResponse(200, updatedProfile, 'Profile updated successfully')
    );
  });

  /*
   * Get Orders (Active vs History logic handled by query param)
   * GET /api/v1/customer/orders?status=active|history
   */
  getOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const status = req.query.status as string;
    const orders = await customerService.getOrders(userId, status);

    return res.status(200).json(
      new ApiResponse(200, orders, 'Orders fetched successfully')
    );
  });

  /*
   * Get Vouchers
   * GET /api/v1/customer/vouchers
   */
  getVouchers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const vouchers = await customerService.getVouchers(userId);
    
    return res.status(200).json(
      new ApiResponse(200, vouchers, 'Vouchers fetched successfully')
    );
  });

  /*
   * Get Favourites
   * GET /api/v1/customer/favourites
   */
  getFavourites = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const favourites = await customerService.getFavourites(userId);
    
    return res.status(200).json(
      new ApiResponse(200, favourites, 'Favourites fetched successfully')
    );
  });

  /*
   * Toggle Favourite
   * POST /api/v1/customer/favourites/:productId/toggle
   */
  toggleFavourite = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.params;
    
    if (!userId) throw new ApiError(401, 'Unauthorized');
    if (!productId) throw new ApiError(400, 'Product ID is required');

    const result = await customerService.toggleFavourite(userId, productId as string);
    
    const message = result.isFavourited ? 'Added to favourites' : 'Removed from favourites';

    return res.status(200).json(
      new ApiResponse(200, result, message)
    );
  });
}

export const customerController = new CustomerController();
