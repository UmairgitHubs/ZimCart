import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { distanceKm as haversineKm, parseCoordsFromAddress, HARARE_CENTER } from '../utils/geo.js';
import { assignRiderToOrder } from './order.service.js';

const getEffectiveStoreId = async (managerId: string) => {
  const store = await prisma.store.findFirst({ where: { managerId } });
  return store?.id;
};

/**
 * Auto-assign the best available rider:
 * 1) Prefer riders with GPS nearest to delivery drop-off
 * 2) Tie-break: fewest active deliveries
 */
export const autoDispatchOrder = async (orderId: string, user: any) => {
  const where: any = {
    OR: [{ id: orderId }, { orderNumber: orderId }],
  };
  if (user.role === 'STORE_MANAGER') {
    const storeId = await getEffectiveStoreId(user.id);
    if (!storeId) throw new ApiError(403, 'Store context not found');
    where.storeId = storeId;
  }

  const order = await prisma.order.findFirst({ where });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.riderId) throw new ApiError(400, 'Order already has a rider assigned');
  if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
    throw new ApiError(400, 'Cannot dispatch a closed order');
  }

  const dropoff =
    parseCoordsFromAddress(order.address) ?? HARARE_CENTER;

  const riders = await prisma.user.findMany({
    where: {
      role: 'RIDER',
      status: 'ACTIVE',
      riderProfile: { availability: 'AVAILABLE' },
    },
    include: {
      riderProfile: true,
      _count: {
        select: {
          assignedDeliveries: {
            where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'] } },
          },
        },
      },
    },
  });

  if (!riders.length) {
    throw new ApiError(404, 'No available riders online for auto-dispatch');
  }

  const scored = riders.map((r) => {
    const profile = r.riderProfile!;
    let dist = 9999;
    if (profile.lastLatitude != null && profile.lastLongitude != null) {
      dist = haversineKm(
        profile.lastLatitude,
        profile.lastLongitude,
        dropoff.lat,
        dropoff.lng
      );
    }
    return {
      riderId: r.id,
      name: r.name,
      distanceKm: Math.round(dist * 10) / 10,
      activeJobs: r._count.assignedDeliveries,
      score: dist * 10 + r._count.assignedDeliveries,
    };
  });

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0];
  if (!best) {
    throw new ApiError(404, 'No available riders online for auto-dispatch');
  }

  const updated = await assignRiderToOrder(order.orderNumber, best.riderId, user);

  return {
    order: updated,
    dispatch: {
      riderId: best.riderId,
      riderName: best.name,
      distanceKm: best.distanceKm,
      candidatesConsidered: scored.length,
    },
  };
};

export const getDispatchCandidates = async (orderId: string, user: any) => {
  const where: any = {
    OR: [{ id: orderId }, { orderNumber: orderId }],
  };
  if (user.role === 'STORE_MANAGER') {
    const storeId = await getEffectiveStoreId(user.id);
    if (!storeId) throw new ApiError(403, 'Store context not found');
    where.storeId = storeId;
  }

  const order = await prisma.order.findFirst({ where });
  if (!order) throw new ApiError(404, 'Order not found');

  const dropoff = parseCoordsFromAddress(order.address) ?? HARARE_CENTER;

  const riders = await prisma.user.findMany({
    where: {
      role: 'RIDER',
      status: 'ACTIVE',
      riderProfile: { isNot: null },
    },
    include: {
      riderProfile: true,
      _count: {
        select: {
          assignedDeliveries: {
            where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'] } },
          },
        },
      },
    },
  });

  return riders
    .map((r) => {
      const profile = r.riderProfile!;
      let distanceKm: number | null = null;
      if (profile.lastLatitude != null && profile.lastLongitude != null) {
        distanceKm =
          Math.round(
            haversineKm(profile.lastLatitude, profile.lastLongitude, dropoff.lat, dropoff.lng) * 10
          ) / 10;
      }
      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        availability: profile.availability,
        vehicleType: profile.vehicleType,
        licensePlate: profile.licensePlate,
        distanceKm,
        activeJobs: r._count.assignedDeliveries,
        canAssign: profile.availability === 'AVAILABLE' || profile.availability === 'DISPATCHED',
      };
    })
    .sort((a, b) => {
      const da = a.distanceKm ?? 9999;
      const db = b.distanceKm ?? 9999;
      if (da !== db) return da - db;
      return a.activeJobs - b.activeJobs;
    });
};

export const getFleetLiveLocations = async () => {
  const riders = await prisma.user.findMany({
    where: { role: 'RIDER', status: { not: 'BLOCKED' } },
    include: {
      riderProfile: true,
      assignedDeliveries: {
        where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'] } },
        select: { id: true, orderNumber: true, status: true },
        take: 3,
      },
    },
  });

  return riders.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    status: r.riderProfile?.availability ?? 'OFFLINE',
    vehicleType: r.riderProfile?.vehicleType,
    latitude: r.riderProfile?.lastLatitude,
    longitude: r.riderProfile?.lastLongitude,
    lastLocationAt: r.riderProfile?.lastLocationAt?.toISOString() ?? null,
    activeOrders: r.assignedDeliveries,
  }));
};
