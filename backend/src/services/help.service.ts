import prisma from '../config/db.js';

export const getFAQs = async (category?: string) => {
  const where: any = { isActive: true };
  if (category) {
    where.category = category;
  }

  return (prisma as any).fAQ.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  });
};

export const createTicket = async (userId: string, subject: string, message: string) => {
  return prisma.supportTicket.create({
    data: {
      userId,
      subject,
      message,
      status: 'OPEN',
    },
  });
};
