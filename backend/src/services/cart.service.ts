import { Prisma } from '@prisma/client';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getCart = async (userId: string) => {
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
    cart = await (prisma.cart.create as any)({
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

  return cart as any;
};

export const addToCart = async (userId: string, productId: string, quantity: number, variants: any = null) => {
  const cart = await getCart(userId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { storeId: true },
  });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (cart!.items.length > 0) {
    const existingStoreId = cart!.items[0].product.storeId;
    if (product.storeId !== existingStoreId) {
      throw new ApiError(
        400,
        'Your cart already has items from another store. Clear your cart or finish that order first.'
      );
    }
  }

  // Normalize variants for consistent lookup
  const normalizedVariants = (variants && typeof variants === 'object' && Object.keys(variants).length > 0) 
    ? variants 
    : null;

  // Check if item with same variants already exists
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart!.id,
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
      cartId: cart!.id,
      productId,
      quantity: Number(quantity),
      variants: normalizedVariants === null ? Prisma.DbNull : normalizedVariants
    },
    include: { product: true }
  });
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  const cart = await getCart(userId);
  
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId }
  });

  if (!item || item.cartId !== cart!.id) {
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

export const removeFromCart = async (userId: string, itemId: string) => {
  const cart = await getCart(userId);
  
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId }
  });

  if (!item || item.cartId !== cart!.id) {
    throw new ApiError(404, 'Cart item not found');
  }

  return prisma.cartItem.delete({ where: { id: itemId } });
};

export const clearCart = async (userId: string) => {
  const cart = await getCart(userId);
  return prisma.cartItem.deleteMany({
    where: { cartId: cart!.id }
  });
};
