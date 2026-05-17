import type { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { notifyRiderNewAssignment } from './rider-mobile.service.js';
import { syncPaymentWithOrderStatus } from './payment.service.js';
import { onOrderStatusChanged, onRiderAssigned } from './order-delivery.service.js';

const ACTIVE_RIDER_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'] as const;

const getEffectiveStoreId = async (managerId: string) => {
    const store = await prisma.store.findFirst({
        where: { managerId }
    });
    return store?.id;
};

const resolveOrderWhere = async (orderId: string, user: any) => {
    const where: any = {
        OR: [{ id: orderId }, { orderNumber: orderId }],
    };

    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId) throw new ApiError(403, 'Store context not found');
        where.storeId = storeId;
    }

    return where;
};

const syncRiderAvailability = async (riderId: string) => {
    const activeCount = await prisma.order.count({
        where: {
            riderId,
            status: { in: [...ACTIVE_RIDER_ORDER_STATUSES] },
        },
    });

    await prisma.riderProfile.updateMany({
        where: { userId: riderId },
        data: { availability: activeCount > 0 ? 'DISPATCHED' : 'AVAILABLE' },
    });
};

const orderInclude = {
    user: {
        select: { id: true, name: true, email: true, avatar: true, phone: true },
    },
    rider: {
        select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            riderProfile: {
                select: { vehicleType: true, licensePlate: true },
            },
        },
    },
    payment: { select: { status: true } },
    items: {
        include: {
            product: { select: { id: true, name: true, price: true, images: true } },
        },
    },
} satisfies Prisma.OrderInclude;

function mapPaymentStatusFromLedger(
    paymentStatus: string | undefined,
    orderStatus: OrderStatus,
    paymentMethod: string
): string {
    if (paymentStatus === 'PAID') return 'Paid';
    if (paymentStatus === 'PENDING') return 'Pending';
    if (paymentStatus === 'FAILED') return 'Unpaid';
    if (paymentStatus === 'CANCELLED' || paymentStatus === 'REFUNDED') return 'Cancelled';
    if (orderStatus === 'CANCELLED') return 'Cancelled';
    if (paymentMethod.toLowerCase().includes('cash')) {
        return orderStatus === 'COMPLETED' ? 'Paid' : 'Pending';
    }
    return 'Paid';
}

function mapDbStatusToAdmin(status: OrderStatus): string {
    switch (status) {
        case 'PENDING':
            return 'Pending';
        case 'CONFIRMED':
        case 'PREPARING':
            return 'Confirmed';
        case 'SHIPPING':
            return 'Shipped';
        case 'COMPLETED':
            return 'Delivered';
        case 'CANCELLED':
            return 'Cancelled';
        default:
            return 'Pending';
    }
}

function adminTabToDbStatuses(tab: string): OrderStatus[] | undefined {
    switch (tab) {
        case 'Pending':
            return ['PENDING'];
        case 'Confirmed':
            return ['CONFIRMED', 'PREPARING'];
        case 'Shipped':
            return ['SHIPPING'];
        case 'Delivered':
            return ['COMPLETED'];
        case 'Cancelled':
            return ['CANCELLED'];
        default:
            return undefined;
    }
}

function mapAdminOrder(order: Prisma.OrderGetPayload<{ include: typeof orderInclude }>) {
    const mappedStatus = mapDbStatusToAdmin(order.status);
    const paymentStatus = mapPaymentStatusFromLedger(
        order.payment?.status,
        order.status,
        order.paymentMethod
    );

    return {
        id: order.orderNumber,
        dbId: order.id,
        customer: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
            avatar:
                order.user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user.name)}&background=10B981&color=fff`,
            phone: order.user.phone || null,
        },
        items: order.items.map((item) => {
            const snappedName = item.name;
            const displayName =
                snappedName && snappedName !== 'Generic Item' ? snappedName : item.product.name;
            return {
                id: item.id,
                productId: item.productId,
                name: displayName,
                quantity: item.quantity,
                price: item.price,
                image:
                    item.product.images && item.product.images.length > 0
                        ? item.product.images[0]
                        : null,
            };
        }),
        totalAmount: order.total,
        subtotal: order.subtotal,
        platformFee: order.platformFee ?? 0,
        discount: order.discount ?? 0,
        deliveryFee: order.deliveryFee,
        status: mappedStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shippingAddress: order.address,
        trackingUrl: order.trackingUrl ?? null,
        proofOfDeliveryUrl: order.proofOfDeliveryUrl ?? null,
        notes: order.notes || '',
        assignedRider: order.rider
            ? {
                  id: order.rider.id,
                  name: order.rider.name,
                  phone: order.rider.phone || null,
                  avatar:
                      order.rider.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(order.rider.name)}&background=0d9488&color=fff`,
                  vehicleType: order.rider.riderProfile?.vehicleType || 'Motorcycle',
                  licensePlate: order.rider.riderProfile?.licensePlate || null,
              }
            : null,
        assignedAt: order.assignedAt ? order.assignedAt.toISOString() : null,
    };
}

export const getAllOrders = async (query: any, user: any) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId) {
            return { orders: [], pagination: { total: 0, page, pages: 0, limit } };
        }
        where.storeId = storeId;
    }

    const statusFilter = adminTabToDbStatuses(String(query.status || ''));
    if (statusFilter) {
        where.status = { in: statusFilter };
    }

    if (query.search?.trim()) {
        const term = String(query.search).trim();
        where.OR = [
            { orderNumber: { contains: term, mode: 'insensitive' } },
            { user: { name: { contains: term, mode: 'insensitive' } } },
            { user: { email: { contains: term, mode: 'insensitive' } } },
        ];
    }

    const range = String(query.range || 'All Time');
    if (range !== 'All Time') {
        const now = new Date();
        if (range === 'Today') {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            where.createdAt = { gte: start };
        } else if (range === 'This Week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            where.createdAt = { gte: weekAgo };
        } else if (range === 'This Month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            where.createdAt = { gte: start };
        }
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: orderInclude,
        }),
        prisma.order.count({ where }),
    ]);

    return {
        orders: orders.map(mapAdminOrder),
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit) || 0,
            limit,
        },
    };
};

export const assignRiderToOrder = async (orderId: string, riderId: string, user: any) => {
    const where = await resolveOrderWhere(orderId, user);
    const order = await prisma.order.findFirst({ where });

    if (!order) {
        throw new ApiError(404, 'Order not found or access denied');
    }

    if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
        throw new ApiError(400, 'Cannot assign a rider to a completed or cancelled order');
    }

    const rider = await prisma.user.findFirst({
        where: { id: riderId, role: 'RIDER' },
        include: { riderProfile: true },
    });

    if (!rider || !rider.riderProfile) {
        throw new ApiError(404, 'Rider not found');
    }

    if (rider.status === 'BLOCKED') {
        throw new ApiError(400, 'This rider account is blocked');
    }

    const previousRiderId = order.riderId;

    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
            riderId,
            assignedAt: new Date(),
        },
        include: {
            store: { select: { name: true } },
            rider: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    avatar: true,
                    riderProfile: { select: { vehicleType: true, licensePlate: true } },
                },
            },
        },
    });

    await notifyRiderNewAssignment(riderId, {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        store: updatedOrder.store,
    });

    await syncRiderAvailability(riderId);

    if (previousRiderId && previousRiderId !== riderId) {
        await syncRiderAvailability(previousRiderId);
    }

    await onRiderAssigned({
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        userId: order.userId,
        status: updatedOrder.status,
    });

    return updatedOrder;
};

export const unassignRiderFromOrder = async (orderId: string, user: any) => {
    const where = await resolveOrderWhere(orderId, user);
    const order = await prisma.order.findFirst({ where });

    if (!order) {
        throw new ApiError(404, 'Order not found or access denied');
    }

    if (!order.riderId) {
        throw new ApiError(400, 'No rider is assigned to this order');
    }

    const previousRiderId = order.riderId;

    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
            riderId: null,
            assignedAt: null,
        },
    });

    await syncRiderAvailability(previousRiderId);

    return updatedOrder;
};

export const updateOrderStatus = async (orderId: string, newStatus: string, user: any) => {
    const validStatuses = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "COMPLETED", "CANCELLED"];
    
    // Reverse map from frontend string to backend enum if needed
    let dbStatus = newStatus.toUpperCase();
    if (newStatus === "Delivered") dbStatus = "COMPLETED";
    if (newStatus === "Shipped") dbStatus = "SHIPPING";

    if (!validStatuses.includes(dbStatus)) {
        throw new ApiError(400, "Invalid order status");
    }

    const where = await resolveOrderWhere(orderId, user);

    const order = await prisma.order.findFirst({ where });
    if (!order) {
        throw new ApiError(404, "Order not found or access denied");
    }

    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: dbStatus as OrderStatus },
    });

    await syncPaymentWithOrderStatus(updatedOrder.id, dbStatus);
    await onOrderStatusChanged({
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        userId: order.userId,
        status: updatedOrder.status,
    });

    return updatedOrder;
};

export const deleteOrder = async (orderId: string, user: any) => {
    const where: any = {
        OR: [
            { id: orderId },
            { orderNumber: orderId }
        ]
    };

    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId) throw new ApiError(403, "Store context not found");
        where.storeId = storeId;
    }

    const order = await prisma.order.findFirst({ where });

    if (!order) {
        throw new ApiError(404, "Order not found or access denied");
    }

    await prisma.order.delete({
        where: { id: order.id }
    });

    return true;
};

export const getOrderStats = async (user: any) => {
    const where: any = {};
    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId) return { totalVolume: 0, pendingOrders: 0, grossRevenue: 0, canceledRate: '0.0%' };
        where.storeId = storeId;
    }

    const [totalVolume, pendingOrders, revenueData, canceledCount] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.count({ where: { ...where, status: 'PENDING' } }),
        prisma.order.aggregate({
            where: { ...where, status: { not: 'CANCELLED' } },
            _sum: { total: true }
        }),
        prisma.order.count({ where: { ...where, status: 'CANCELLED' } })
    ]);

    const grossRevenue = revenueData._sum.total || 0;
    const canceledRate = totalVolume > 0 ? ((canceledCount / totalVolume) * 100).toFixed(1) + '%' : '0.0%';

    return {
        totalVolume,
        pendingOrders,
        grossRevenue,
        canceledRate
    };
};

const resolveOrderItems = async (items: any[], storeId: string) => {
    return await Promise.all(items.map(async (item: any) => {
        let productId = item.productId || item.id;
        
        let product = null;
        if (productId && productId.length === 36) {
            product = await prisma.product.findUnique({ where: { id: productId } });
        }

        if (!product) {
            product = await prisma.product.findFirst({
                where: { name: item.name, storeId }
            });
        }

        if (!product) {
            product = await prisma.product.findFirst({
                where: { name: "Custom Manual Item", storeId }
            });

            if (!product) {
                let miscCategory = await prisma.category.findFirst({
                    where: { name: "Miscellaneous", storeId }
                });

                if (!miscCategory) {
                    miscCategory = await prisma.category.create({
                        data: { name: "Miscellaneous", storeId, status: "Hidden" } as any
                    });
                }

                product = await prisma.product.create({
                    data: {
                        name: "Custom Manual Item",
                        sku: `MANUAL-${storeId.slice(0, 8)}-${Date.now()}`,
                        price: item.price,
                        inventory: 9999,
                        status: "Hidden",
                        storeId,
                        categoryId: miscCategory.id,
                        description: "Internal placeholder for manual/custom order items."
                    } as any
                });
            }
        }

        return {
            productId: product.id,
            name: item.name || product.name, // Fallback to product name if item name is missing
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        };
    }));
};

export const createManualOrder = async (orderData: any, user: any) => {
    const { customerName, customerPhone, customerEmail, deliveryAddress, paymentMethod, items, status, deliveryFee, notes } = orderData;

    let storeId = "";
    if (user.role === 'STORE_MANAGER') {
        const store = await prisma.store.findFirst({ where: { managerId: user.id } });
        if (!store) throw new ApiError(403, "Store context not found");
        storeId = store.id;
    } else {
        const firstStore = await prisma.store.findFirst();
        if (!firstStore) throw new ApiError(400, "No store found in system");
        storeId = firstStore.id;
    }

    // Find or create customer (User)
    let dbUser = await prisma.user.findFirst({
        where: { OR: [{ email: customerEmail || "none" }, { phone: customerPhone }] }
    });

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                name: customerName,
                email: customerEmail || `guest-${Date.now()}@zimcart.internal`,
                phone: customerPhone,
                role: 'CUSTOMER',
                password: 'manual_order_guest'
            } as any
        });
    } else if (customerName && dbUser.name !== customerName) {
        dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { name: customerName }
        });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const finalDeliveryFee = Number(deliveryFee) || 0;
    const tax = subtotal * 0.05; // Standard 5% Tax
    const total = subtotal + finalDeliveryFee + tax;

    const orderCount = await prisma.order.count();
    const orderNumber = `#ORD-${(10000 + orderCount + 1).toString()}`;

    const resolvedItems = await resolveOrderItems(items, storeId);

    const newOrder = await prisma.order.create({
        data: {
            orderNumber,
            status: (status?.toUpperCase() || "PENDING") as any,
            total,
            subtotal,
            deliveryFee: finalDeliveryFee,
            notes: (notes as any) || "",
            address: deliveryAddress,
            paymentMethod,
            userId: dbUser.id,
            storeId,
            items: {
                create: resolvedItems
            }
        } as any,
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        }
    });

    return newOrder;
};

export const updateOrder = async (orderId: string, orderData: any, user: any) => {
    const { customerName, customerPhone, customerEmail, deliveryAddress, paymentMethod, items, status, deliveryFee, notes } = orderData;

    // Senior: Build a flexible filter that looks for either UUID or Human ID (orderNumber)
    const where: any = {
        OR: [
            { id: orderId },
            { orderNumber: orderId }
        ]
    };

    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId) throw new ApiError(403, "Store context not found");
        where.storeId = storeId;
    }

    const order = await prisma.order.findFirst({ where, include: { user: true } });
    if (!order) throw new ApiError(404, "Order not found or access denied");

    // Update User if needed
    if (customerName && order.user.name !== customerName) {
        await prisma.user.update({
            where: { id: order.userId },
            data: { name: customerName }
        });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const finalDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : order.deliveryFee;
    const tax = subtotal * 0.05; // Standard 5% Tax
    const total = subtotal + finalDeliveryFee + tax;

    // Resolve items (reusing helper logic)
    const resolvedItems = await resolveOrderItems(items, order.storeId);

    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
            status: (status?.toUpperCase() || order.status) as any,
            total,
            subtotal,
            deliveryFee: finalDeliveryFee,
            notes: notes !== undefined ? (notes as any) : (order as any).notes,
            address: deliveryAddress,
            paymentMethod,
            items: {
                deleteMany: {},
                create: resolvedItems
            }
        } as any,
        include: {
            user: true,
            items: { include: { product: true } }
        }
    });

    return updatedOrder;
};
