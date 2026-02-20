import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';

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
      select: { id: true, isTwoFactorEnabled: true, dataSharingConsent: true }, 
    });
  }

  async exportUserData(userId: string) {
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

    // Mask sensitive fields
    const { password: _, refreshToken: __, resetPasswordToken: ___, ...safeData } = user;
    
    // In a production environment, this would generate a PDF/JSON and send it
    // For now, we utilize our email service to send a summary
    import('./email.service.js').then(m => m.sendDataExportEmail(user.email, safeData)).catch(console.error);
    
    return { message: "Data export requested. You will receive an email shortly." };
  }

  async clearHistory(userId: string, type: 'search' | 'view' | 'all') {
    if (type === 'search' || type === 'all') {
      await prisma.searchHistory.deleteMany({ where: { userId } });
    }
    if (type === 'view' || type === 'all') {
      await prisma.viewHistory.deleteMany({ where: { userId } });
    }
    return { message: `${type.charAt(0).toUpperCase() + type.slice(1)} history cleared successfully` };
  }

  async getSessions(userId: string, currentIp?: string) {
    const sessions = await prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' },
    });

    // Mark current session based on IP (simplified)
    return sessions.map((session: any) => ({
      ...session,
      isCurrent: session.ipAddress === currentIp,
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    return prisma.userSession.delete({
      where: { id: sessionId, userId },
    });
  }

  async revokeAllOtherSessions(userId: string, currentSessionId?: string) {
    return prisma.userSession.deleteMany({
      where: { 
        userId,
        NOT: { id: currentSessionId }
      },
    });
  }

  async deleteAccount(userId: string, passwordConfirmation: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, 'User not found');

    // Security: Verify password before deletion
    const isPasswordCorrect = await bcrypt.compare(passwordConfirmation, user.password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Incorrect password. Account deletion aborted.');
    }

    // Senior Implementation: Use a transaction for all cleanup logic
    return await prisma.$transaction(async (tx: any) => {
      // 1. Manually clean up relations if not cascaded at DB level
      // Note: Some models might already have Cascade in schema, but manual cleanup is safer if unsure
      await tx.userSession.deleteMany({ where: { userId } });
      await tx.searchHistory.deleteMany({ where: { userId } });
      await tx.viewHistory.deleteMany({ where: { userId } });
      await tx.favourite.deleteMany({ where: { userId } });
      await tx.address.deleteMany({ where: { userId } });
      await tx.userVoucher.deleteMany({ where: { userId } });
      await tx.notificationPreference.delete({ where: { userId } }).catch(() => {});

      // 2. Finally delete the user
      return tx.user.delete({
        where: { id: userId },
      });
    });
  }
}

export const customerService = new CustomerService();
