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
  /*
   * Addresses
   */
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }, // Default address first
    });
  }

  async addAddress(userId: string, data: any) {
    if (data.isDefault) {
      // Unset other defaults
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
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new ApiError(404, 'Address not found or unauthorized');
    }

    if (data.isDefault) {
      // Unset other defaults
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new ApiError(404, 'Address not found or unauthorized');
    }

    return prisma.address.delete({
      where: { id: addressId },
    });
  }

  /*
   * Security & Settings
   */
  async updateSecuritySettings(userId: string, data: { isTwoFactorEnabled?: boolean, dataSharingConsent?: boolean }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, isTwoFactorEnabled: true, dataSharingConsent: true }, // Return only updated fields
    });
  }

  async deleteAccount(userId: string) {
    // In a real app, you might want soft delete or schedule deletion
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const customerService = new CustomerService();
