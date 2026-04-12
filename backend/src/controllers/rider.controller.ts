import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as riderService from '../services/rider.service.js';
import type { RiderUiStatus } from '../services/rider.service.js';

export const listRiders = asyncHandler(async (req, res) => {
  const page = parseInt(String(req.query.page || '1'), 10) || 1;
  const limit = Math.min(parseInt(String(req.query.limit || '50'), 10) || 50, 100);
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const status = typeof req.query.status === 'string' ? (req.query.status as RiderUiStatus | 'All') : 'All';

  const result = await riderService.listRiders({
    page,
    limit,
    search,
    status: status === 'All' ? 'All' : (status as RiderUiStatus),
  });

  return res.status(200).json(new ApiResponse(200, result, 'Riders fetched successfully'));
});

export const createRider = asyncHandler(async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const rider = await riderService.createRider({
    name: String(body.name),
    email: String(body.email),
    phone: String(body.phone),
    password: String(body.password),
    nationalId: typeof body.nationalId === 'string' ? body.nationalId : undefined,
    vehicleType: typeof body.vehicleType === 'string' ? body.vehicleType : undefined,
    licensePlate: typeof body.licensePlate === 'string' ? body.licensePlate : undefined,
    homeBaseLabel: typeof body.homeBaseLabel === 'string' ? body.homeBaseLabel : undefined,
    availability:
      body.availability === 'AVAILABLE' || body.availability === 'DISPATCHED' || body.availability === 'OFFLINE'
        ? body.availability
        : undefined,
    accountStatus:
      body.accountStatus === 'ACTIVE' || body.accountStatus === 'INACTIVE' || body.accountStatus === 'BLOCKED'
        ? body.accountStatus
        : undefined,
  });
  return res.status(201).json(new ApiResponse(201, { rider }, 'Rider onboarded successfully'));
});

export const updateRider = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const body = req.body as Record<string, unknown>;

  const rider = await riderService.updateRider(id, {
    name: typeof body.name === 'string' ? body.name : undefined,
    email: typeof body.email === 'string' ? body.email : undefined,
    phone: typeof body.phone === 'string' ? body.phone : undefined,
    nationalId: body.nationalId === null ? null : typeof body.nationalId === 'string' ? body.nationalId : undefined,
    vehicleType: typeof body.vehicleType === 'string' ? body.vehicleType : undefined,
    licensePlate: body.licensePlate === null ? null : typeof body.licensePlate === 'string' ? body.licensePlate : undefined,
    homeBaseLabel: body.homeBaseLabel === null ? null : typeof body.homeBaseLabel === 'string' ? body.homeBaseLabel : undefined,
    status:
      body.status === 'Available' ||
      body.status === 'Dispatched' ||
      body.status === 'Offline' ||
      body.status === 'Banned'
        ? (body.status as RiderUiStatus)
        : undefined,
    availability:
      body.availability === 'AVAILABLE' || body.availability === 'DISPATCHED' || body.availability === 'OFFLINE'
        ? body.availability
        : undefined,
    accountStatus:
      body.accountStatus === 'ACTIVE' || body.accountStatus === 'INACTIVE' || body.accountStatus === 'BLOCKED'
        ? body.accountStatus
        : undefined,
    completedDropoffs: typeof body.completedDropoffs === 'number' ? body.completedDropoffs : undefined,
    rating: typeof body.rating === 'number' ? body.rating : undefined,
  });

  return res.status(200).json(new ApiResponse(200, { rider }, 'Rider updated successfully'));
});

export const deleteRider = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  await riderService.deleteRider(id);
  return res.status(200).json(new ApiResponse(200, null, 'Rider removed successfully'));
});
