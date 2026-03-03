import * as customerService from '../services/customer.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getDeviceInfo } from '../utils/device.utils.js';
import * as notificationService from '../services/notification.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const profile = await customerService.getProfile(userId);
  
  return res.status(200).json(
    new ApiResponse(200, profile, 'User profile fetched successfully')
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const updatedProfile = await customerService.updateProfile(userId, req.body);
  
  return res.status(200).json(
    new ApiResponse(200, updatedProfile, 'Profile updated successfully')
  );
});

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const status = req.query.status as string;
  const orders = await customerService.getOrders(userId, status);

  return res.status(200).json(
    new ApiResponse(200, orders, 'Orders fetched successfully')
  );
});

export const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const order = await customerService.placeOrder(userId, req.body);

  return res.status(201).json(
    new ApiResponse(201, order, 'Order placed successfully')
  );
});

export const getVouchers = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const vouchers = await customerService.getVouchers(userId);
  
  return res.status(200).json(
    new ApiResponse(200, vouchers, 'Vouchers fetched successfully')
  );
});

export const getFavourites = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const favourites = await customerService.getFavourites(userId);
  
  return res.status(200).json(
    new ApiResponse(200, favourites, 'Favourites fetched successfully')
  );
});

export const toggleFavourite = asyncHandler(async (req, res) => {
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

export const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const addresses = await customerService.getAddresses(userId);
  
  return res.status(200).json(
    new ApiResponse(200, addresses, 'Addresses fetched successfully')
  );
});

export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const address = await customerService.addAddress(userId, req.body);
  
  return res.status(201).json(
    new ApiResponse(201, address, 'Address added successfully')
  );
});

export const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const address = await customerService.updateAddress(userId, id as string, req.body);
  
  return res.status(200).json(
    new ApiResponse(200, address, 'Address updated successfully')
  );
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  await customerService.deleteAddress(userId, id as string);
  
  return res.status(200).json(
    new ApiResponse(200, {}, 'Address deleted successfully')
  );
});

export const updateSecuritySettings = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const settings = await customerService.updateSecuritySettings(userId, req.body);
  
  return res.status(200).json(
    new ApiResponse(200, settings, 'Security settings updated successfully')
  );
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { password } = req.body;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  await customerService.deleteAccount(userId, password);
  
  return res.status(200).json(
    new ApiResponse(200, {}, 'Account deleted successfully')
  );
});

export const requestDataExport = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const result = await customerService.exportUserData(userId);
  
  return res.status(200).json(
    new ApiResponse(200, result, 'Data export requested successfully')
  );
});

export const clearHistory = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const { type } = req.body;
  const result = await customerService.clearHistory(userId, type || 'all');
  
  return res.status(200).json(
    new ApiResponse(200, result, 'History cleared successfully')
  );
});

export const getSessions = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');
  
  const { ipAddress } = getDeviceInfo(req);
  const sessions = await customerService.getSessions(userId, ipAddress);

  return res.status(200).json(
    new ApiResponse(200, sessions, 'User sessions fetched successfully')
  );
});

export const revokeSession = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  await customerService.revokeSession(userId, id as string);

  return res.status(200).json(
    new ApiResponse(200, {}, 'Session revoked successfully')
  );
});

export const revokeAllOtherSessions = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const sessionId = req.user?.sessionId;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  await customerService.revokeAllOtherSessions(userId, sessionId);

  return res.status(200).json(
    new ApiResponse(200, {}, 'All other sessions revoked successfully')
  );
});

export const updatePushToken = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { pushToken } = req.body;

  if (!userId) throw new ApiError(401, 'Unauthorized');
  if (!pushToken) throw new ApiError(400, 'Push token is required');

  const result = await notificationService.updatePushToken(userId, pushToken);

  return res.status(200).json(
    new ApiResponse(200, result, 'Push token updated successfully')
  );
});

export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const result = await customerService.updateNotificationPreferences(userId, req.body);

  return res.status(200).json(
    new ApiResponse(200, result, 'Notification preferences updated successfully')
  );
});

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const result = await customerService.getNotifications(userId);

  return res.status(200).json(
    new ApiResponse(200, result, 'Notifications retrieved successfully')
  );
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const result = await customerService.markNotificationRead(userId, req.params.id as string);

  return res.status(200).json(
    new ApiResponse(200, result, 'Notification marked as read')
  );
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const result = await customerService.markAllNotificationsRead(userId);

  return res.status(200).json(
    new ApiResponse(200, result, 'All notifications marked as read')
  );
});
