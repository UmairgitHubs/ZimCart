import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import {
  assertOrderTotalsMatch,
  computeOrderTotals,
  computeVoucherDiscountAmount,
} from './order-pricing.service.js';
import { createPaymentForOrder } from './payment.service.js';

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

  if (status === 'active') {
    whereClause.status = { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'] };
  } else if (status === 'history') {
    whereClause.status = { in: ['COMPLETED', 'CANCELLED'] };
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

const TRACKING_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED'] as const;

function buildStatusTimeline(status: string) {
  const order = TRACKING_STATUSES.indexOf(status as (typeof TRACKING_STATUSES)[number]);
  return TRACKING_STATUSES.map((step, idx) => ({
    step,
    label:
      step === 'PENDING'
        ? 'Order placed'
        : step === 'CONFIRMED'
          ? 'Confirmed'
          : step === 'PREPARING'
            ? 'Preparing'
            : step === 'SHIPPING'
              ? 'Out for delivery'
              : step === 'COMPLETED'
                ? 'Delivered'
                : 'Cancelled',
    completed: status === 'CANCELLED' ? step === 'CANCELLED' : idx <= order,
    current: step === status,
  }));
}

export const getOrderTracking = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      store: { select: { id: true, name: true, image: true } },
      rider: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
          riderProfile: {
            select: {
              vehicleType: true,
              licensePlate: true,
              lastLatitude: true,
              lastLongitude: true,
              lastLocationAt: true,
            },
          },
        },
      },
      items: {
        include: {
          product: { select: { name: true, images: true } },
        },
      },
    },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const riderProfile = order.rider?.riderProfile;
  const showRiderLocation =
    order.status === 'SHIPPING' &&
    order.riderId &&
    riderProfile?.lastLatitude != null &&
    riderProfile?.lastLongitude != null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    discount: order.discount,
    total: order.total,
    address: order.address,
    paymentMethod: order.paymentMethod,
    trackingUrl: order.trackingUrl,
    proofOfDeliveryUrl:
      order.status === 'COMPLETED' ? (order.proofOfDeliveryUrl ?? null) : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    store: order.store,
    items: order.items,
    timeline: buildStatusTimeline(order.status),
    rider: order.rider
      ? {
          id: order.rider.id,
          name: order.rider.name,
          phone: order.rider.phone,
          avatar: order.rider.avatar,
          vehicleType: riderProfile?.vehicleType ?? 'Motorcycle',
          licensePlate: riderProfile?.licensePlate ?? null,
        }
      : null,
    riderLocation: showRiderLocation
      ? {
          latitude: riderProfile!.lastLatitude!,
          longitude: riderProfile!.lastLongitude!,
          updatedAt: riderProfile!.lastLocationAt,
        }
      : null,
  };
};

export const previewOrder = async (userId: string, data: any) => {
  const voucherCode =
    typeof data.voucherCode === 'string' && data.voucherCode.trim()
      ? data.voucherCode.trim()
      : undefined;

  return computeOrderTotals(userId, {
    storeId: data.storeId,
    items: data.items,
    deliveryFee: data.deliveryFee,
    voucherCode,
  });
};

export const placeOrder = async (userId: string, data: any) => {
  const {
    storeId,
    items,
    total,
    subtotal,
    deliveryFee,
    discount: clientDiscount,
    address,
    paymentMethod,
    voucherCode: rawVoucherCode,
  } = data;

  if (!storeId || !items?.length) {
    throw new ApiError(400, 'storeId and items are required');
  }
  if (!address || typeof address !== 'string') {
    throw new ApiError(400, 'Delivery address is required');
  }
  if (!paymentMethod || typeof paymentMethod !== 'string') {
    throw new ApiError(400, 'Payment method is required');
  }

  const voucherCode =
    typeof rawVoucherCode === 'string' && rawVoucherCode.trim() ? rawVoucherCode.trim().toUpperCase() : '';

  if (clientDiscount && Number(clientDiscount) > 0 && !voucherCode) {
    throw new ApiError(400, 'Discount requires a valid voucher code');
  }

  const priced = await assertOrderTotalsMatch(userId, {
    storeId,
    items,
    subtotal,
    deliveryFee,
    discount: clientDiscount,
    total,
    ...(voucherCode ? { voucherCode } : {}),
  });

  let voucherIdForMarkUsed: string | null = null;
  if (voucherCode) {
    const voucher = await prisma.voucher.findUnique({
      where: { code: voucherCode },
    });
    voucherIdForMarkUsed = voucher?.id ?? null;
  }

  const order = await prisma.$transaction(async (tx) => {
    if (voucherIdForMarkUsed) {
      const userVoucher = await tx.userVoucher.findUnique({
        where: {
          userId_voucherId: { userId, voucherId: voucherIdForMarkUsed },
        },
      });
      if (userVoucher?.isUsed) {
        throw new ApiError(400, 'You have already used this voucher');
      }
      if (userVoucher) {
        await tx.userVoucher.update({
          where: { id: userVoucher.id },
          data: { isUsed: true, usedAt: new Date() },
        });
      }
    }

    const newOrder = await tx.order.create({
      data: {
        orderNumber: `#ZM-${Math.floor(10000 + Math.random() * 90000)}`,
        userId,
        storeId,
        total: priced.total,
        subtotal: priced.subtotal,
        deliveryFee: priced.deliveryFee,
        platformFee: priced.platformFee,
        discount: priced.discount,
        address,
        paymentMethod,
        items: {
          create: priced.items.map((row) => ({
            productId: row.productId,
            quantity: row.quantity,
            price: row.price,
            total: row.total,
            name: row.name,
          })),
        },
      },
      include: {
        store: true,
        items: {
          include: { product: true },
        },
      },
    });

    await createPaymentForOrder(tx, {
      id: newOrder.id,
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
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

export const validateVoucher = async (userId: string, code: string) => {
  // 1. Find the voucher
  const voucher = await prisma.voucher.findUnique({
    where: { code: code.toUpperCase() }
  });

  if (!voucher) {
    throw new ApiError(404, 'Invalid voucher code');
  }

  // 2. Check if active and not expired
  if (!voucher.isActive || new Date(voucher.expiryDate) < new Date()) {
    throw new ApiError(400, 'This voucher has expired or is no longer active');
  }

  // 3. User specific checks (only if it's meant for claimed vouchers)
  const userVoucher = await prisma.userVoucher.findUnique({
    where: {
      userId_voucherId: { userId, voucherId: voucher.id }
    }
  });

  if (userVoucher && userVoucher.isUsed) {
    throw new ApiError(400, 'You have already used this voucher');
  }

  return voucher;
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
    await tx.paymentMethod.deleteMany({ where: { userId } });
    await tx.userVoucher.deleteMany({ where: { userId } });
    await tx.notificationPreference.delete({ where: { userId } }).catch(() => {});

    return tx.user.delete({
      where: { id: userId },
    });
  });
};



// --- ADMIN DASHBOARD EXPORTS ---
export const getAllCustomersForAdmin = async (query: any, user: any) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let where: any = { role: 'CUSTOMER' };

    // 1. Status Filter
    if (query.status && query.status !== 'All') {
        where.status = query.status.toUpperCase();
    }

    // 2. Search Logic (Name, Email, Phone, or ID)
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
            { phone: { contains: query.search, mode: 'insensitive' } },
            { id: { contains: query.search, mode: 'insensitive' } },
        ];
    }

    // 3. Strict Multi-tenancy Isolation for Store Managers
    if (user.role === 'STORE_MANAGER') {
        const store = await prisma.store.findFirst({
            where: { managerId: user.id }
        });
        
        if (store) {
            // Only show customers who have ordered from this store
            where.orders = {
                some: {
                    storeId: store.id
                }
            };
        } else {
            return { customers: [], pagination: { total: 0, page, pages: 0 } };
        }
    }

    const [count, customers] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            include: {
                orders: { select: { total: true, status: true, storeId: true } },
                sessions: { orderBy: { lastActive: 'desc'}, take: 1 },
                addresses: { where: { isDefault: true }, take: 1 }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        })
    ]);

    const formattedCustomers = customers.map(cust => {
        const completedOrders = cust.orders.filter(o => o.status === 'COMPLETED');
        const totalSpent = completedOrders.reduce((acc, curr) => acc + curr.total, 0);
        
        return {
            id: cust.id,
            name: cust.name,
            email: cust.email,
            joinDate: cust.createdAt,
            status: (cust as any).status.charAt(0).toUpperCase() + (cust as any).status.slice(1).toLowerCase(),
            totalSpent,
            totalOrders: cust.orders.length,
            lastLogin: cust.sessions.length > 0 ? cust.sessions[0]?.lastActive : cust.createdAt,
            location: cust.addresses.length > 0 ? cust.addresses[0]?.address : "N/A",
            avatar: cust.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cust.name)}&background=10B981&color=fff&format=png`,
            phone: cust.phone || "N/A",
        };
    });

    return {
        customers: formattedCustomers,
        pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit)
        }
    };
};

export const createCustomerForAdmin = async (data: any) => {
   const hashedPassword = await bcrypt.hash(data.password || 'zimcart123', 10);
   const newUser = await prisma.user.create({
       data: {
           name: data.name,
           email: data.email,
           phone: data.phone || data.phoneNumber,
           password: hashedPassword,
           role: 'CUSTOMER',
           avatar: data.avatar
       }
   });
   return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        joinDate: newUser.createdAt,
        status: "Active",
        totalSpent: 0,
        totalOrders: 0,
        lastLogin: newUser.createdAt,
        location: "N/A",
        avatar: newUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=10B981&color=fff&format=png`,
         phone: newUser.phone || "N/A",
   };
};

export const updateCustomerForAdmin = async (id: string, data: any) => {
    // Determine target enum using incoming titlecase enum 
    const targetStatus = typeof data.status === 'string' ? data.status.toUpperCase() : undefined;

    const updated = await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
             phone: data.phone || data.phoneNumber,
             avatar: data.avatar,
            ...(targetStatus && { status: targetStatus as any })
        }
    });

    return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
         phone: updated.phone || "N/A",
        status: (updated as any).status.charAt(0).toUpperCase() + (updated as any).status.slice(1).toLowerCase(),
    };
};

export const deleteCustomerForAdmin = async (id: string, user: any) => {
    // 1. Permission Guard
    if (user.role === 'STORE_MANAGER') {
        const store = await prisma.store.findFirst({
            where: { managerId: user.id }
        });
        
        if (!store) throw new ApiError(403, "No store association found");

        const hasOrderedFromMe = await prisma.order.findFirst({
            where: { userId: id, storeId: store.id }
        });

        if (!hasOrderedFromMe) {
            throw new ApiError(403, "Access Denied: You can only purge customers who have engaged with your store.");
        }
    }

    // 2. Atomic purge
    return await prisma.$transaction(async (tx) => {
        // 1. Clear Security & Session data
        await tx.userSession.deleteMany({ where: { userId: id } });
        
        // 2. Clear Engagement data
        await tx.searchHistory.deleteMany({ where: { userId: id } });
        await tx.viewHistory.deleteMany({ where: { userId: id } });
        await tx.favourite.deleteMany({ where: { userId: id } });
        
        // 3. Clear Financial & Logistics data
        await tx.address.deleteMany({ where: { userId: id } });
        await tx.paymentMethod.deleteMany({ where: { userId: id } });
        await tx.userVoucher.deleteMany({ where: { userId: id } });
        
        // 4. Handle Notifications
        await tx.notificationPreference.delete({ where: { userId: id } }).catch(() => {});
        await tx.notification.deleteMany({ where: { userId: id } });

        // 5. Handle Orders (Purge Everything)
        // Since the schema requires a valid userId, we purge orders to maintain referential integrity.
        await tx.order.deleteMany({
            where: { userId: id }
        });

        // 6. Handle Support Tickets
        await tx.supportTicket.deleteMany({ where: { userId: id } });

        // 7. Finally Purge the User
        return tx.user.delete({
            where: { id }
        });
    });
};

export const getPaymentMethods = async (userId: string) => {
  return prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { type: 'asc' }
    ]
  });
};

export const addPaymentMethod = async (userId: string, data: any) => {
  if (data.isDefault) {
    await prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  } else {
    // If no methods exist, make this the default
    const count = await prisma.paymentMethod.count({ where: { userId } });
    if (count === 0) data.isDefault = true;
  }

  return prisma.paymentMethod.create({
    data: {
      ...data,
      userId
    }
  });
};

export const setDefaultPaymentMethod = async (userId: string, paymentMethodId: string) => {
  const method = await prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId }
  });

  if (!method || method.userId !== userId) {
    throw new ApiError(404, 'Payment method not found or unauthorized');
  }

  // Remove old default
  await prisma.paymentMethod.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false }
  });

  // Set new default
  return prisma.paymentMethod.update({
    where: { id: paymentMethodId },
    data: { isDefault: true }
  });
};

export const deletePaymentMethod = async (userId: string, paymentMethodId: string) => {
  const method = await prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId }
  });

  if (!method || method.userId !== userId) {
    throw new ApiError(404, 'Payment method not found or unauthorized');
  }

  await prisma.paymentMethod.delete({
    where: { id: paymentMethodId }
  });

  if (method.isDefault) {
    // Assign a new default if one exists
    const nextMethod = await prisma.paymentMethod.findFirst({
      where: { userId }
    });
    
    if (nextMethod) {
      await prisma.paymentMethod.update({
        where: { id: nextMethod.id },
        data: { isDefault: true }
      });
    }
  }

  return true;
};

