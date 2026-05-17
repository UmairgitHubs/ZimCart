import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
const getEffectiveStoreId = async (managerId) => {
    const store = await prisma.store.findFirst({
        where: { managerId }
    });
    return store?.id;
};
export const getAllOrders = async (query, user) => {
    const where = {};
    // Strict Multi-tenancy Isolation
    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId)
            return []; // No store, no orders
        where.storeId = storeId;
    }
    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { id: true, name: true, email: true, avatar: true, phone: true }
            },
            items: {
                include: {
                    product: { select: { id: true, name: true, price: true, images: true } }
                }
            }
        }
    });
    // Map Prisma to frontend expected structure
    const mappedOrders = orders.map(order => {
        let paymentStatus = "Paid";
        if (order.paymentMethod.toLowerCase().includes("cash")) {
            paymentStatus = order.status === "COMPLETED" ? "Paid" : "Pending";
        }
        if (order.status === "CANCELLED") {
            paymentStatus = "Cancelled";
        }
        let mappedStatus = "Pending";
        switch (order.status) {
            case "PENDING":
                mappedStatus = "Pending";
                break;
            case "CONFIRMED":
                mappedStatus = "Confirmed";
                break;
            case "PREPARING":
                mappedStatus = "Confirmed";
                break; // Collapse preparing
            case "SHIPPING":
                mappedStatus = "Shipped";
                break;
            case "COMPLETED":
                mappedStatus = "Delivered";
                break;
            case "CANCELLED":
                mappedStatus = "Cancelled";
                break;
        }
        const subtotal = order.subtotal || order.total;
        const deliveryFee = order.deliveryFee || 0;
        const tax = subtotal * 0.05;
        const calculatedTotal = subtotal + deliveryFee + tax;
        return {
            id: order.orderNumber,
            dbId: order.id,
            customer: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email,
                avatar: order.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user.name)}&background=10B981&color=fff`,
                phone: order.user.phone || null
            },
            items: order.items.map(item => {
                const snappedName = item.name;
                const displayName = (snappedName && snappedName !== "Generic Item")
                    ? snappedName
                    : item.product.name;
                return {
                    id: item.id,
                    productId: item.productId,
                    name: displayName,
                    quantity: item.quantity,
                    price: item.price,
                    image: (item.product.images && item.product.images.length > 0) ? item.product.images[0] : null
                };
            }),
            totalAmount: calculatedTotal, // Unified Calculated Total
            subtotal,
            tax,
            deliveryFee,
            status: mappedStatus,
            paymentMethod: order.paymentMethod,
            paymentStatus: paymentStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            shippingAddress: order.address,
            notes: order.notes || ""
        };
    });
    return mappedOrders;
};
export const updateOrderStatus = async (orderId, newStatus, user) => {
    const validStatuses = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "COMPLETED", "CANCELLED"];
    // Reverse map from frontend string to backend enum if needed
    let dbStatus = newStatus.toUpperCase();
    if (newStatus === "Delivered")
        dbStatus = "COMPLETED";
    if (newStatus === "Shipped")
        dbStatus = "SHIPPING";
    if (!validStatuses.includes(dbStatus)) {
        throw new ApiError(400, "Invalid order status");
    }
    const where = { orderNumber: orderId };
    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId)
            throw new ApiError(403, "Store context not found");
        where.storeId = storeId;
    }
    const order = await prisma.order.findFirst({ where });
    if (!order) {
        throw new ApiError(404, "Order not found or access denied");
    }
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: dbStatus }
    });
    return updatedOrder;
};
export const deleteOrder = async (orderId, user) => {
    const where = {
        OR: [
            { id: orderId },
            { orderNumber: orderId }
        ]
    };
    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId)
            throw new ApiError(403, "Store context not found");
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
export const getOrderStats = async (user) => {
    const where = {};
    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId)
            return { totalVolume: 0, pendingOrders: 0, grossRevenue: 0, canceledRate: '0.0%' };
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
const resolveOrderItems = async (items, storeId) => {
    return await Promise.all(items.map(async (item) => {
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
                        data: { name: "Miscellaneous", storeId, status: "Hidden" }
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
                    }
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
export const createManualOrder = async (orderData, user) => {
    const { customerName, customerPhone, customerEmail, deliveryAddress, paymentMethod, items, status, deliveryFee, notes } = orderData;
    let storeId = "";
    if (user.role === 'STORE_MANAGER') {
        const store = await prisma.store.findFirst({ where: { managerId: user.id } });
        if (!store)
            throw new ApiError(403, "Store context not found");
        storeId = store.id;
    }
    else {
        const firstStore = await prisma.store.findFirst();
        if (!firstStore)
            throw new ApiError(400, "No store found in system");
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
            }
        });
    }
    else if (customerName && dbUser.name !== customerName) {
        dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { name: customerName }
        });
    }
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalDeliveryFee = Number(deliveryFee) || 0;
    const tax = subtotal * 0.05; // Standard 5% Tax
    const total = subtotal + finalDeliveryFee + tax;
    const orderCount = await prisma.order.count();
    const orderNumber = `#ORD-${(10000 + orderCount + 1).toString()}`;
    const resolvedItems = await resolveOrderItems(items, storeId);
    const newOrder = await prisma.order.create({
        data: {
            orderNumber,
            status: (status?.toUpperCase() || "PENDING"),
            total,
            subtotal,
            deliveryFee: finalDeliveryFee,
            notes: notes || "",
            address: deliveryAddress,
            paymentMethod,
            userId: dbUser.id,
            storeId,
            items: {
                create: resolvedItems
            }
        },
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        }
    });
    return newOrder;
};
export const updateOrder = async (orderId, orderData, user) => {
    const { customerName, customerPhone, customerEmail, deliveryAddress, paymentMethod, items, status, deliveryFee, notes } = orderData;
    // Senior: Build a flexible filter that looks for either UUID or Human ID (orderNumber)
    const where = {
        OR: [
            { id: orderId },
            { orderNumber: orderId }
        ]
    };
    if (user.role === 'STORE_MANAGER') {
        const storeId = await getEffectiveStoreId(user.id);
        if (!storeId)
            throw new ApiError(403, "Store context not found");
        where.storeId = storeId;
    }
    const order = await prisma.order.findFirst({ where, include: { user: true } });
    if (!order)
        throw new ApiError(404, "Order not found or access denied");
    // Update User if needed
    if (customerName && order.user.name !== customerName) {
        await prisma.user.update({
            where: { id: order.userId },
            data: { name: customerName }
        });
    }
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : order.deliveryFee;
    const tax = subtotal * 0.05; // Standard 5% Tax
    const total = subtotal + finalDeliveryFee + tax;
    // Resolve items (reusing helper logic)
    const resolvedItems = await resolveOrderItems(items, order.storeId);
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
            status: (status?.toUpperCase() || order.status),
            total,
            subtotal,
            deliveryFee: finalDeliveryFee,
            notes: notes !== undefined ? notes : order.notes,
            address: deliveryAddress,
            paymentMethod,
            items: {
                deleteMany: {},
                create: resolvedItems
            }
        },
        include: {
            user: true,
            items: { include: { product: true } }
        }
    });
    return updatedOrder;
};
//# sourceMappingURL=order.service.js.map