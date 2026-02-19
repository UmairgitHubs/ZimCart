import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export class CustomerService {
  /*
   * Profile Management
   */
  async getProfile(userId: string) {
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

    // Removing sensitive data
    const { password, ...userData } = user;
    return userData;
  }

  async updateProfile(userId: string, data: any) {
    // Only allow specific updates
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
  }

  /*
   * Orders
   */
  async getOrders(userId: string, status?: string) {
    const whereClause: any = { userId };
    
    if (status && status !== 'active') {
      whereClause.status = { not: 'PENDING' }; // Simplified logic
    }
    
    // Fetch orders with store info
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        store: {
          select: { name: true, image: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, image: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  /*
   * Vouchers
   */
  async getVouchers(userId: string, status: string = 'active') {
    // Fetch generic vouchers not tied to specific user usage yet + specific user vouchers
    // Simplified: Fetch all active vouchers available to user
    // In db, UserVoucher links user to vouchers they have claimed/used.
    
    // 1. Get user's vouchers
    const userVouchers = await prisma.userVoucher.findMany({
      where: { userId },
      include: {
        voucher: true,
      },
    });

    return userVouchers;
  }

  /*
   * Favourites
   */
  async getFavourites(userId: string) {
    const favourites = await prisma.favourite.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    return favourites.map((f: any) => f.product);
  }

  async toggleFavourite(userId: string, productId: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Check if exists
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
  }
}

export const customerService = new CustomerService();
