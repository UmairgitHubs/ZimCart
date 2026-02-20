import type { Request, Response } from 'express';
import { customerService } from '../services/customer.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getDeviceInfo } from '../utils/device.utils.js';



export class CustomerController {

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const profile = await customerService.getProfile(userId);
    
    return res.status(200).json(
      new ApiResponse(200, profile, 'User profile fetched successfully')
    );
  });


  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const updatedProfile = await customerService.updateProfile(userId, req.body);
    
    return res.status(200).json(
      new ApiResponse(200, updatedProfile, 'Profile updated successfully')
    );
  });

 
  getOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const status = req.query.status as string;
    const orders = await customerService.getOrders(userId, status);

    return res.status(200).json(
      new ApiResponse(200, orders, 'Orders fetched successfully')
    );
  });


  getVouchers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const vouchers = await customerService.getVouchers(userId);
    
    return res.status(200).json(
      new ApiResponse(200, vouchers, 'Vouchers fetched successfully')
    );
  });


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

  /*
   * Addresses
   */
  getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const addresses = await customerService.getAddresses(userId);
    
    return res.status(200).json(
      new ApiResponse(200, addresses, 'Addresses fetched successfully')
    );
  });

  addAddress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const address = await customerService.addAddress(userId, req.body);
    
    return res.status(201).json(
      new ApiResponse(201, address, 'Address added successfully')
    );
  });

  updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const address = await customerService.updateAddress(userId, id as string, req.body);
    
    return res.status(200).json(
      new ApiResponse(200, address, 'Address updated successfully')
    );
  });

  deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    await customerService.deleteAddress(userId, id as string);
    
    return res.status(200).json(
      new ApiResponse(200, {}, 'Address deleted successfully')
    );
  });

  /*
   * Security
   */
  updateSecuritySettings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const settings = await customerService.updateSecuritySettings(userId, req.body);
    
    return res.status(200).json(
      new ApiResponse(200, settings, 'Security settings updated successfully')
    );
  });

  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { password } = req.body;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    await customerService.deleteAccount(userId, password);
    
    return res.status(200).json(
      new ApiResponse(200, {}, 'Account deleted successfully')
    );
  });

  requestDataExport = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const result = await customerService.exportUserData(userId);
    
    return res.status(200).json(
      new ApiResponse(200, result, 'Data export requested successfully')
    );
  });

  clearHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const { type } = req.body;
    const result = await customerService.clearHistory(userId, type || 'all');
    
    return res.status(200).json(
      new ApiResponse(200, result, 'History cleared successfully')
    );
  });

  getSessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    
    const { ipAddress } = getDeviceInfo(req);
    const sessions = await customerService.getSessions(userId, ipAddress);

    return res.status(200).json(
        new ApiResponse(200, sessions, 'User sessions fetched successfully')
    );
  });

  revokeSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    await customerService.revokeSession(userId, id as string);

    return res.status(200).json(
        new ApiResponse(200, {}, 'Session revoked successfully')
    );
  });

  revokeAllOtherSessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.user?.sessionId;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    await customerService.revokeAllOtherSessions(userId, sessionId);

    return res.status(200).json(
        new ApiResponse(200, {}, 'All other sessions revoked successfully')
    );
  });
}

export const customerController = new CustomerController();
