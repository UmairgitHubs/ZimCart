import { Prisma } from '@prisma/client';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
export const getCart = async (userId) => {
    let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            images: true,
                            brand: true,
                            storeId: true,
                            inventory: true,
                            store: {
                                select: {
                                    deliveryFee: true,
                                    minOrder: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                                brand: true,
                                storeId: true,
                                inventory: true,
                                store: {
                                    select: {
                                        deliveryFee: true,
                                        minOrder: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    return cart;
};
export const addToCart = async (userId, productId, quantity, variants = null) => {
    const cart = await getCart(userId);
    // Normalize variants for consistent lookup
    const normalizedVariants = (variants && typeof variants === 'object' && Object.keys(variants).length > 0)
        ? variants
        : null;
    // Check if item with same variants already exists
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
            variants: { equals: normalizedVariants === null ? Prisma.DbNull : normalizedVariants }
        }
    });
    if (existingItem) {
        return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + Number(quantity) },
            include: { product: true }
        });
    }
    return prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity: Number(quantity),
            variants: normalizedVariants === null ? Prisma.DbNull : normalizedVariants
        },
        include: { product: true }
    });
};
export const updateCartItem = async (userId, itemId, quantity) => {
    const cart = await getCart(userId);
    const item = await prisma.cartItem.findUnique({
        where: { id: itemId }
    });
    if (!item || item.cartId !== cart.id) {
        throw new ApiError(404, 'Cart item not found');
    }
    if (quantity <= 0) {
        return prisma.cartItem.delete({ where: { id: itemId } });
    }
    return prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: { product: true }
    });
};
export const removeFromCart = async (userId, itemId) => {
    const cart = await getCart(userId);
    const item = await prisma.cartItem.findUnique({
        where: { id: itemId }
    });
    if (!item || item.cartId !== cart.id) {
        throw new ApiError(404, 'Cart item not found');
    }
    return prisma.cartItem.delete({ where: { id: itemId } });
};
export const clearCart = async (userId) => {
    const cart = await getCart(userId);
    return prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
    });
};
//# sourceMappingURL=cart.service.js.map