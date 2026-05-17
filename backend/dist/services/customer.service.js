import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
/** Must match customer cart checkout (`CartScreen`). */
const ORDER_PLATFORM_FEE = 20;
function computeVoucherDiscountAmount(voucher, subtotal) {
    if (voucher.discountType === 'FIXED') {
        return Math.min(voucher.value, subtotal);
    }
    const pct = (subtotal * voucher.value) / 100;
    if (voucher.maxDiscount != null && voucher.maxDiscount > 0) {
        return Math.min(pct, voucher.maxDiscount, subtotal);
    }
    return Math.min(pct, subtotal);
}
export const getProfile = async (userId) => {
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
export const updateProfile = async (userId, data) => {
    const allowedUpdates = ['name', 'phone', 'avatar', 'isPremium'];
    const updateData = {};
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
export const getOrders = async (userId, status) => {
    const whereClause = { userId };
    if (status === 'active') {
        whereClause.status = { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'] };
    }
    else if (status === 'history') {
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
export const placeOrder = async (userId, data) => {
    const { storeId, items, total, subtotal, deliveryFee, discount: clientDiscount, address, paymentMethod, voucherCode: rawVoucherCode, } = data;
    const voucherCode = typeof rawVoucherCode === 'string' && rawVoucherCode.trim() ? rawVoucherCode.trim().toUpperCase() : '';
    if (clientDiscount && Number(clientDiscount) > 0 && !voucherCode) {
        throw new ApiError(400, 'Discount requires a valid voucher code');
    }
    let validatedVoucher = null;
    if (voucherCode) {
        validatedVoucher = await validateVoucher(userId, voucherCode);
    }
    const order = await prisma.$transaction(async (tx) => {
        let serverSubtotal = 0;
        const itemCreates = [];
        for (const item of items) {
            const product = await tx.product.findUnique({
                where: { id: item.productId },
                select: { id: true, name: true, price: true, storeId: true },
            });
            if (!product) {
                throw new ApiError(400, `Product not found: ${item.productId}`);
            }
            if (product.storeId !== storeId) {
                throw new ApiError(400, 'Cart contains items from a different store');
            }
            const lineTotal = product.price * item.quantity;
            serverSubtotal += lineTotal;
            itemCreates.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
                total: lineTotal,
                name: product.name,
            });
        }
        if (Math.abs(serverSubtotal - Number(subtotal)) > 0.02) {
            throw new ApiError(400, 'Subtotal mismatch. Refresh your cart and try again.');
        }
        let serverDiscount = 0;
        if (validatedVoucher) {
            const minSpend = validatedVoucher.minSpend ?? 0;
            if (serverSubtotal < minSpend) {
                throw new ApiError(400, `This voucher requires a minimum spend of Rs. ${minSpend}`);
            }
            serverDiscount = computeVoucherDiscountAmount(validatedVoucher, serverSubtotal);
            const userVoucher = await tx.userVoucher.findUnique({
                where: {
                    userId_voucherId: { userId, voucherId: validatedVoucher.id },
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
        const df = Number(deliveryFee) || 0;
        const expectedTotal = Math.max(0, serverSubtotal + df + ORDER_PLATFORM_FEE - serverDiscount);
        if (Math.abs(expectedTotal - Number(total)) > 0.05) {
            throw new ApiError(400, 'Order total mismatch. Refresh your cart and try again.');
        }
        const newOrder = await tx.order.create({
            data: {
                orderNumber: `#ZM-${Math.floor(10000 + Math.random() * 90000)}`,
                userId,
                storeId,
                total: expectedTotal,
                subtotal: serverSubtotal,
                deliveryFee: df,
                discount: serverDiscount,
                address,
                paymentMethod,
                items: {
                    create: itemCreates.map((row) => ({
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
        return newOrder;
    });
    import('./notification.service.js').then(m => {
        m.sendNotification([userId], 'Order Placed Successfully! 🍛', `Your order ${order.orderNumber} from ${order.store.name} has been received and is being processed.`, { type: 'ORDER', orderId: order.id }).catch(err => console.error("Notification failed inside order flow:", err));
    }).catch(console.error);
    return order;
};
export const getVouchers = async (userId, status = 'active') => {
    const userVouchers = await prisma.userVoucher.findMany({
        where: { userId },
        include: {
            voucher: true,
        },
    });
    return userVouchers;
};
export const validateVoucher = async (userId, code) => {
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
export const getFavourites = async (userId) => {
    const favourites = await prisma.favourite.findMany({
        where: { userId },
        include: {
            product: true,
        },
    });
    return favourites.map((f) => f.product);
};
export const toggleFavourite = async (userId, productId) => {
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
    }
    else {
        await prisma.favourite.create({
            data: { userId, productId },
        });
        return { isFavourited: true };
    }
};
export const getAddresses = async (userId) => {
    return prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' },
    });
};
export const addAddress = async (userId, data) => {
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
export const updateAddress = async (userId, addressId, data) => {
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
export const deleteAddress = async (userId, addressId) => {
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
export const updateSecuritySettings = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, isTwoFactorEnabled: true, dataSharingConsent: true },
    });
};
export const updateNotificationPreferences = async (userId, data) => {
    return prisma.notificationPreference.upsert({
        where: { userId },
        update: data,
        create: {
            ...data,
            userId
        }
    });
};
export const getNotifications = async (userId) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });
};
export const markNotificationRead = async (userId, notificationId) => {
    return prisma.notification.update({
        where: { id: notificationId, userId },
        data: { isRead: true }
    });
};
export const markAllNotificationsRead = async (userId) => {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
};
export const exportUserData = async (userId) => {
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
    if (!user)
        throw new ApiError(404, "User not found");
    const { password: _, refreshToken: __, resetPasswordToken: ___, ...safeData } = user;
    import('./email.service.js').then(m => m.sendDataExportEmail(user.email, safeData)).catch(console.error);
    return { message: "Data export requested. You will receive an email shortly." };
};
export const clearHistory = async (userId, type) => {
    if (type === 'search' || type === 'all') {
        await prisma.searchHistory.deleteMany({ where: { userId } });
    }
    if (type === 'view' || type === 'all') {
        await prisma.viewHistory.deleteMany({ where: { userId } });
    }
    return { message: `${type.charAt(0).toUpperCase() + type.slice(1)} history cleared successfully` };
};
export const getSessions = async (userId, currentIp) => {
    const sessions = await prisma.userSession.findMany({
        where: { userId },
        orderBy: { lastActive: 'desc' },
    });
    return sessions.map((session) => ({
        ...session,
        isCurrent: session.ipAddress === currentIp,
    }));
};
export const revokeSession = async (userId, sessionId) => {
    return prisma.userSession.delete({
        where: { id: sessionId, userId },
    });
};
export const revokeAllOtherSessions = async (userId, currentSessionId) => {
    return prisma.userSession.deleteMany({
        where: {
            userId,
            ...(currentSessionId ? { NOT: { id: currentSessionId } } : {}),
        },
    });
};
export const deleteAccount = async (userId, passwordConfirmation) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new ApiError(404, 'User not found');
    const isPasswordCorrect = await bcrypt.compare(passwordConfirmation, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Incorrect password. Account deletion aborted.');
    }
    return await prisma.$transaction(async (tx) => {
        await tx.userSession.deleteMany({ where: { userId } });
        await tx.searchHistory.deleteMany({ where: { userId } });
        await tx.viewHistory.deleteMany({ where: { userId } });
        await tx.favourite.deleteMany({ where: { userId } });
        await tx.address.deleteMany({ where: { userId } });
        await tx.paymentMethod.deleteMany({ where: { userId } });
        await tx.userVoucher.deleteMany({ where: { userId } });
        await tx.notificationPreference.delete({ where: { userId } }).catch(() => { });
        return tx.user.delete({
            where: { id: userId },
        });
    });
};
// --- ADMIN DASHBOARD EXPORTS ---
export const getAllCustomersForAdmin = async (query, user) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    let where = { role: 'CUSTOMER' };
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
        }
        else {
            return { customers: [], pagination: { total: 0, page, pages: 0 } };
        }
    }
    const [count, customers] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            include: {
                orders: { select: { total: true, status: true, storeId: true } },
                sessions: { orderBy: { lastActive: 'desc' }, take: 1 },
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
            status: cust.status.charAt(0).toUpperCase() + cust.status.slice(1).toLowerCase(),
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
export const createCustomerForAdmin = async (data) => {
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
export const updateCustomerForAdmin = async (id, data) => {
    // Determine target enum using incoming titlecase enum 
    const targetStatus = typeof data.status === 'string' ? data.status.toUpperCase() : undefined;
    const updated = await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone || data.phoneNumber,
            avatar: data.avatar,
            ...(targetStatus && { status: targetStatus })
        }
    });
    return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone || "N/A",
        status: updated.status.charAt(0).toUpperCase() + updated.status.slice(1).toLowerCase(),
    };
};
export const deleteCustomerForAdmin = async (id, user) => {
    // 1. Permission Guard
    if (user.role === 'STORE_MANAGER') {
        const store = await prisma.store.findFirst({
            where: { managerId: user.id }
        });
        if (!store)
            throw new ApiError(403, "No store association found");
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
        await tx.notificationPreference.delete({ where: { userId: id } }).catch(() => { });
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
export const getPaymentMethods = async (userId) => {
    return prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: [
            { isDefault: 'desc' },
            { type: 'asc' }
        ]
    });
};
export const addPaymentMethod = async (userId, data) => {
    if (data.isDefault) {
        await prisma.paymentMethod.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false }
        });
    }
    else {
        // If no methods exist, make this the default
        const count = await prisma.paymentMethod.count({ where: { userId } });
        if (count === 0)
            data.isDefault = true;
    }
    return prisma.paymentMethod.create({
        data: {
            ...data,
            userId
        }
    });
};
export const setDefaultPaymentMethod = async (userId, paymentMethodId) => {
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
export const deletePaymentMethod = async (userId, paymentMethodId) => {
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
//# sourceMappingURL=customer.service.js.map