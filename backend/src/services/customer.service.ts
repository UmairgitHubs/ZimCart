import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: { orders: true, vouchers: true, favourites: true },
      },
      notifications: true,
      addresses: {
        where: { isDefault: true },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { password, ...userData } = user;
  return userData;
};

export const updateProfile = async (userId: string, data: any) => {
  const allowedUpdates = ['name', 'phone', 'avatar', 'isPremium'];
  const updateData: any = {};

  Object.keys(data).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updateData[key] = data[key];
    }
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  const { password, ...userData } = user;
  return userData;
};

export const getOrders = async (userId: string, status?: string) => {
  const whereClause: any = { userId };
  
  if (status && status !== 'active') {
    whereClause.status = { not: 'PENDING' };
  }
  
  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      store: {
        select: { name: true, image: true },
      },
      items: {
        include: {
          product: {
            select: { name: true, images: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

export const placeOrder = async (userId: string, data: any) => {
  const { storeId, items, total, subtotal, deliveryFee, discount, address, paymentMethod } = data;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: `#ZM-${Math.floor(10000 + Math.random() * 90000)}`,
        userId,
        storeId,
        total,
        subtotal,
        deliveryFee,
        discount: discount || 0,
        address,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: {
        store: true,
        items: {
          include: { product: true }
        }
      }
    });
    return newOrder;
  });

  import('./notification.service.js').then(m => {
      m.sendNotification(
          [userId],
          'Order Placed Successfully! 🍛',
          `Your order ${order.orderNumber} from ${order.store.name} has been received and is being processed.`,
          { type: 'ORDER', orderId: order.id }
      ).catch(err => console.error("Notification failed inside order flow:", err));
  }).catch(console.error);

  return order;
};

export const getVouchers = async (userId: string, status: string = 'active') => {
  const userVouchers = await prisma.userVoucher.findMany({
    where: { userId },
    include: {
      voucher: true,
    },
  });

  return userVouchers;
};

export const getFavourites = async (userId: string) => {
  const favourites = await prisma.favourite.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });
  return favourites.map((f: any) => f.product);
};

export const toggleFavourite = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const existing = await prisma.favourite.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    await prisma.favourite.delete({
      where: { id: existing.id },
    });
    return { isFavourited: false };
  } else {
    await prisma.favourite.create({
      data: { userId, productId },
    });
    return { isFavourited: true };
  }
};

export const getAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  });
};

export const addAddress = async (userId: string, data: any) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateAddress = async (userId: string, addressId: string, data: any) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new ApiError(404, 'Address not found or unauthorized');
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new ApiError(404, 'Address not found or unauthorized');
  }

  return prisma.address.delete({
    where: { id: addressId },
  });
};

export const updateSecuritySettings = async (userId: string, data: { isTwoFactorEnabled?: boolean, dataSharingConsent?: boolean }) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, isTwoFactorEnabled: true, dataSharingConsent: true }, 
  });
};

export const updateNotificationPreferences = async (userId: string, data: any) => {
  return prisma.notificationPreference.upsert({
    where: { userId },
    update: data,
    create: {
      ...data,
      userId
    }
  });
};

export const getNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
};

export const markNotificationRead = async (userId: string, notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId, userId },
    data: { isRead: true }
  });
};

export const markAllNotificationsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};

export const exportUserData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      orders: {
        include: {
           items: {
             include: { product: true }
           }
        }
      },
      notifications: true,
      searchHistory: true,
      viewHistory: true,
    }
  });

  if (!user) throw new ApiError(404, "User not found");

  const { password: _, refreshToken: __, resetPasswordToken: ___, ...safeData } = user;
  
  import('./email.service.js').then(m => m.sendDataExportEmail(user.email, safeData)).catch(console.error);
  
  return { message: "Data export requested. You will receive an email shortly." };
};

export const clearHistory = async (userId: string, type: 'search' | 'view' | 'all') => {
  if (type === 'search' || type === 'all') {
    await prisma.searchHistory.deleteMany({ where: { userId } });
  }
  if (type === 'view' || type === 'all') {
    await prisma.viewHistory.deleteMany({ where: { userId } });
  }
  return { message: `${type.charAt(0).toUpperCase() + type.slice(1)} history cleared successfully` };
};

export const getSessions = async (userId: string, currentIp?: string) => {
  const sessions = await prisma.userSession.findMany({
    where: { userId },
    orderBy: { lastActive: 'desc' },
  });

  return sessions.map((session: any) => ({
    ...session,
    isCurrent: session.ipAddress === currentIp,
  }));
};

export const revokeSession = async (userId: string, sessionId: string) => {
  return prisma.userSession.delete({
    where: { id: sessionId, userId },
  });
};

export const revokeAllOtherSessions = async (userId: string, currentSessionId?: string) => {
  return prisma.userSession.deleteMany({
    where: { 
      userId,
      ...(currentSessionId ? { NOT: { id: currentSessionId } } : {}),
    },
  });
};

export const deleteAccount = async (userId: string, passwordConfirmation: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found');

  const isPasswordCorrect = await bcrypt.compare(passwordConfirmation, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Incorrect password. Account deletion aborted.');
  }

  return await prisma.$transaction(async (tx: any) => {
    await tx.userSession.deleteMany({ where: { userId } });
    await tx.searchHistory.deleteMany({ where: { userId } });
    await tx.viewHistory.deleteMany({ where: { userId } });
    await tx.favourite.deleteMany({ where: { userId } });
    await tx.address.deleteMany({ where: { userId } });
    await tx.userVoucher.deleteMany({ where: { userId } });
    await tx.notificationPreference.delete({ where: { userId } }).catch(() => {});

    return tx.user.delete({
      where: { id: userId },
    });
  });
};
