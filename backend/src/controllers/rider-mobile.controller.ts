import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as riderMobileService from '../services/rider-mobile.service.js';

export const getMe = asyncHandler(async (req, res) => {
  const profile = await riderMobileService.getRiderProfile(req.user!.id);
  return res.status(200).json(new ApiResponse(200, { rider: profile }, 'Rider profile fetched'));
});

export const getJobs = asyncHandler(async (req, res) => {
  const filter = (req.query.filter as 'active' | 'completed') || 'active';
  const jobs = await riderMobileService.getRiderJobs(req.user!.id, filter);
  return res.status(200).json(new ApiResponse(200, { jobs }, 'Jobs fetched'));
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await riderMobileService.getRiderJobById(req.user!.id, req.params.orderId as string);
  return res.status(200).json(new ApiResponse(200, { job }, 'Job fetched'));
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;
  const result = await riderMobileService.updateRiderAvailability(req.user!.id, availability);
  return res.status(200).json(new ApiResponse(200, result, 'Availability updated'));
});

export const updateJobStatus = asyncHandler(async (req, res) => {
  const { action, note, proofOfDeliveryUrl } = req.body;
  const job = await riderMobileService.updateJobStatus(
    req.user!.id,
    req.params.orderId as string,
    action,
    note,
    proofOfDeliveryUrl
  );
  return res.status(200).json(new ApiResponse(200, { job }, 'Delivery status updated'));
});

export const getEarnings = asyncHandler(async (req, res) => {
  const earnings = await riderMobileService.getRiderEarnings(req.user!.id);
  return res.status(200).json(new ApiResponse(200, { earnings }, 'Earnings fetched'));
});

export const getNotifications = asyncHandler(async (req, res) => {
  const data = await riderMobileService.getRiderNotifications(req.user!.id);
  return res.status(200).json(new ApiResponse(200, data, 'Notifications fetched'));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await riderMobileService.markRiderNotificationRead(req.user!.id, req.params.id as string);
  return res.status(200).json(new ApiResponse(200, null, 'Notification marked read'));
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await riderMobileService.markAllRiderNotificationsRead(req.user!.id);
  return res.status(200).json(new ApiResponse(200, null, 'All notifications marked read'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const rider = await riderMobileService.updateRiderProfile(req.user!.id, req.body);
  return res.status(200).json(new ApiResponse(200, { rider }, 'Profile updated'));
});

export const updatePushToken = asyncHandler(async (req, res) => {
  await riderMobileService.updateRiderPushToken(req.user!.id, req.body.pushToken);
  return res.status(200).json(new ApiResponse(200, null, 'Push token updated'));
});

export const updateLocation = asyncHandler(async (req, res) => {
  const location = await riderMobileService.updateRiderLocation(
    req.user!.id,
    req.body.latitude,
    req.body.longitude
  );
  return res.status(200).json(new ApiResponse(200, { location }, 'Location updated'));
});
