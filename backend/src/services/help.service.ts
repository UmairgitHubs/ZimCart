import { prisma } from '../config/db.js';

export class HelpService {
  async getFAQs(category?: string) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    return (prisma as any).fAQ.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async createTicket(userId: string, subject: string, message: string) {
    return prisma.supportTicket.create({
      data: {
        userId,
        subject,
        message,
        status: 'OPEN',
      },
    });
  }
}

export const helpService = new HelpService();
