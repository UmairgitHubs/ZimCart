import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { sendNotification } from './notification.service.js';
import { emitToRider } from '../utils/riderSocket.js';
import { onOrderStatusChanged } from './order-delivery.service.js';
import { parseCoordsFromAddress } from '../utils/geo.js';
import type { OrderStatus, RiderAvailability } from '@prisma/client';

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'];
const COMPLETED_STATUSES: OrderStatus[] = ['COMPLETED', 'CANCELLED'];

function mapOrderStatus(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'PREPARING':
      return 'Preparing';
    case 'SHIPPING':
      return 'Out for delivery';
    case 'COMPLETED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

function serializeJob(order: {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  address: string;
  paymentMethod: string;
  notes: string | null;
  proofOfDeliveryUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignedAt: Date | null;
  store: { id: string; name: string; image: string | null; deliveryTime: string | null };
  user: { id: string; name: string; phone: string | null };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    product: { images: string[] };
  }[];
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: mapOrderStatus(order.status),
    dbStatus: order.status,
    total: order.total,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    paymentMethod: order.paymentMethod,
    notes: order.notes || '',
    proofOfDeliveryUrl: order.proofOfDeliveryUrl ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    assignedAt: order.assignedAt?.toISOString() ?? null,
    store: {
      id: order.store.id,
      name: order.store.name,
      image: order.store.image,
      deliveryTime: order.store.deliveryTime,
    },
    customer: {
      id: order.user.id,
      name: order.user.name,
      phone: order.user.phone,
    },
    deliveryAddress: order.address,
    deliveryCoords: parseCoordsFromAddress(order.address),
    items: order.items.map((item) => ({
      id: item.id,
      name:
        item.name && item.name !== 'Generic Item'
          ? item.name
          : (item as { product?: { name?: string } }).product?.name || item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product?.images?.[0] ?? null,
    })),
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

const jobInclude = {
  store: { select: { id: true, name: true, image: true, deliveryTime: true } },
  user: { select: { id: true, name: true, phone: true } },
  items: {
    include: {
      product: { select: { images: true, name: true } },
    },
  },
} as const;

export const getRiderProfile = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: 'RIDER' },
    include: {
      riderProfile: true,
      sessions: { orderBy: { lastActive: 'desc' }, take: 1 },
    },
  });

  if (!user?.riderProfile) {
    throw new ApiError(404, 'Rider profile not found. Contact your fleet manager.');
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [activeJobs, completedJobs, todayEarningsAgg] = await Promise.all([
    prisma.order.count({
      where: { riderId: userId, status: { in: ACTIVE_STATUSES } },
    }),
    prisma.order.count({
      where: { riderId: userId, status: 'COMPLETED' },
    }),
    prisma.order.aggregate({
      where: {
        riderId: userId,
        status: 'COMPLETED',
        updatedAt: { gte: startOfDay },
      },
      _sum: { deliveryFee: true },
    }),
  ]);

  const availability = user.riderProfile.availability;
  const isOnline = availability === 'AVAILABLE' || availability === 'DISPATCHED';

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar:
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d9488&color=fff`,
    vehicleType: user.riderProfile.vehicleType,
    licensePlate: user.riderProfile.licensePlate,
    homeBase: user.riderProfile.homeBaseLabel,
    rating: user.riderProfile.rating,
    completedDeliveries: user.riderProfile.completedDropoffs,
    availability,
    isOnline,
    stats: {
      activeJobs,
      completedJobs,
      todayEarnings: todayEarningsAgg._sum.deliveryFee ?? 0,
    },
  };
};

export const getRiderEarnings = async (userId: string) => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completed = await prisma.order.findMany({
    where: { riderId: userId, status: 'COMPLETED' },
    select: {
      id: true,
      orderNumber: true,
      deliveryFee: true,
      updatedAt: true,
      store: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });

  const sumSince = (since: Date) =>
    completed
      .filter((o) => o.updatedAt >= since)
      .reduce((acc, o) => acc + o.deliveryFee, 0);

  return {
    today: sumSince(startOfDay),
    week: sumSince(startOfWeek),
    month: sumSince(startOfMonth),
    allTime: completed.reduce((acc, o) => acc + o.deliveryFee, 0),
    recent: completed.slice(0, 20).map((o) => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      storeName: o.store.name,
      amount: o.deliveryFee,
      completedAt: o.updatedAt.toISOString(),
    })),
  };
};

export const getRiderNotifications = async (userId: string) => {
  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });
  return {
    unreadCount,
    notifications: items.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      data: n.data,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
  };
};

export const markRiderNotificationRead = async (userId: string, notificationId: string) => {
  const n = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!n) throw new ApiError(404, 'Notification not found');
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const markAllRiderNotificationsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const updateRiderProfile = async (userId: string, data: { phone?: string; name?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
    },
  });
  return getRiderProfile(user.id);
};

export const updateRiderPushToken = async (userId: string, pushToken: string) => {
  const { updatePushToken } = await import('./notification.service.js');
  return updatePushToken(userId, pushToken);
};

export const updateRiderLocation = async (
  userId: string,
  latitude: number,
  longitude: number
) => {
  await prisma.riderProfile.update({
    where: { userId },
    data: {
      lastLatitude: latitude,
      lastLongitude: longitude,
      lastLocationAt: new Date(),
    },
  });
  return { latitude, longitude, updatedAt: new Date().toISOString() };
};

export const notifyRiderNewAssignment = async (
  riderId: string,
  order: { id: string; orderNumber: string; store?: { name?: string } }
) => {
  const title = 'New delivery assigned';
  const body = `${order.orderNumber} from ${order.store?.name || 'store'} — open the app to view details.`;
  await sendNotification([riderId], title, body, {
    type: 'delivery',
    orderId: order.id,
    orderNumber: order.orderNumber,
  });
  emitToRider(riderId, 'order:assigned', {
    orderId: order.id,
    orderNumber: order.orderNumber,
  });
};

export const getRiderJobs = async (userId: string, filter: 'active' | 'completed' = 'active') => {
  const statusFilter =
    filter === 'completed'
      ? { in: COMPLETED_STATUSES }
      : { in: ACTIVE_STATUSES };

  const orders = await prisma.order.findMany({
    where: {
      riderId: userId,
      status: statusFilter,
    },
    orderBy: { assignedAt: 'desc' },
    include: jobInclude,
  });

  return orders.map(serializeJob);
};

export const getRiderJobById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      riderId: userId,
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: jobInclude,
  });

  if (!order) {
    throw new ApiError(404, 'Delivery job not found');
  }

  return serializeJob(order);
};

export const updateRiderAvailability = async (
  userId: string,
  availability: RiderAvailability
) => {
  const profile = await prisma.riderProfile.findUnique({ where: { userId } });
  if (!profile) throw new ApiError(404, 'Rider profile not found');

  if (availability === 'OFFLINE') {
    const activeCount = await prisma.order.count({
      where: { riderId: userId, status: { in: ACTIVE_STATUSES } },
    });
    if (activeCount > 0) {
      throw new ApiError(400, 'Complete or hand off active deliveries before going offline');
    }
  }

  await prisma.riderProfile.update({
    where: { userId },
    data: { availability },
  });

  return { availability, isOnline: availability !== 'OFFLINE' };
};

const RIDER_STATUS_MAP: Record<string, OrderStatus | null> = {
  arrived_at_store: 'PREPARING',
  picked_up: 'SHIPPING',
  out_for_delivery: 'SHIPPING',
  delivered: 'COMPLETED',
  failed_delivery: null,
};

export const updateJobStatus = async (
  userId: string,
  orderId: string,
  action: string,
  note?: string,
  proofOfDeliveryUrl?: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      riderId: userId,
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
  });

  if (!order) throw new ApiError(404, 'Delivery job not found');
  if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
    throw new ApiError(400, 'This delivery is already closed');
  }

  const nextStatus = RIDER_STATUS_MAP[action];
  if (nextStatus === undefined) {
    throw new ApiError(400, 'Invalid delivery action');
  }

  if (action === 'delivered' && proofOfDeliveryUrl && !/^https?:\/\//i.test(proofOfDeliveryUrl)) {
    throw new ApiError(400, 'Proof of delivery must be a valid URL');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updateData: { status?: OrderStatus; notes?: string; proofOfDeliveryUrl?: string } = {};
    if (nextStatus) updateData.status = nextStatus;
    if (action === 'delivered' && proofOfDeliveryUrl) {
      updateData.proofOfDeliveryUrl = proofOfDeliveryUrl;
    }
    if (action === 'failed_delivery') {
      const prefix = '[Rider issue] ';
      const issue = note?.trim() || 'Delivery attempt failed';
      updateData.notes = `${(order as { notes?: string }).notes || ''}\n${prefix}${issue}`.trim();
    }

    const result = await tx.order.update({
      where: { id: order.id },
      data: updateData,
      include: jobInclude,
    });

    if (action === 'delivered') {
      await tx.riderProfile.update({
        where: { userId },
        data: { completedDropoffs: { increment: 1 } },
      });

      const remaining = await tx.order.count({
        where: { riderId: userId, status: { in: ACTIVE_STATUSES }, id: { not: order.id } },
      });

      if (remaining === 0) {
        await tx.riderProfile.update({
          where: { userId },
          data: { availability: 'AVAILABLE' },
        });
      }
    } else {
      await tx.riderProfile.update({
        where: { userId },
        data: { availability: 'DISPATCHED' },
      });
    }

    return result;
  });

  emitToRider(userId, 'order:updated', {
    orderId: updated.id,
    status: updated.status,
    action,
  });

  if (nextStatus) {
    await onOrderStatusChanged({
      id: updated.id,
      orderNumber: updated.orderNumber,
      userId: updated.userId,
      status: nextStatus,
    });
  }

  return serializeJob(updated);
};
