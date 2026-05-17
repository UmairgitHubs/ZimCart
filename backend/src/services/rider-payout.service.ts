import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import type { PayoutStatus } from '@prisma/client';

async function getRiderBalance(riderId: string) {
  const [earned, paid] = await Promise.all([
    prisma.order.aggregate({
      where: { riderId, status: 'COMPLETED' },
      _sum: { deliveryFee: true },
    }),
    prisma.riderPayout.aggregate({
      where: { riderId, status: { in: ['APPROVED', 'PAID'] } },
      _sum: { amount: true },
    }),
  ]);
  const totalEarned = earned._sum.deliveryFee ?? 0;
  const totalPaidOut = paid._sum.amount ?? 0;
  const pendingPayouts = await prisma.riderPayout.aggregate({
    where: { riderId, status: 'PENDING' },
    _sum: { amount: true },
  });
  const pending = pendingPayouts._sum.amount ?? 0;
  const available = Math.max(0, totalEarned - totalPaidOut - pending);
  return { totalEarned, totalPaidOut, pending, available };
}

export const getRiderWallet = async (riderId: string) => {
  const balance = await getRiderBalance(riderId);
  const payouts = await prisma.riderPayout.findMany({
    where: { riderId },
    orderBy: { requestedAt: 'desc' },
    take: 30,
  });
  return {
    ...balance,
    payouts: payouts.map((p) => ({
      id: p.id,
      amount: p.amount,
      method: p.method,
      accountRef: p.accountRef,
      accountName: p.accountName,
      status: p.status,
      notes: p.notes,
      adminNotes: p.adminNotes,
      requestedAt: p.requestedAt.toISOString(),
      processedAt: p.processedAt?.toISOString() ?? null,
    })),
  };
};

export const requestRiderPayout = async (
  riderId: string,
  data: { amount: number; method: string; accountRef: string; accountName?: string; notes?: string }
) => {
  if (data.amount < 1) throw new ApiError(400, 'Minimum payout is Rs 1');
  const balance = await getRiderBalance(riderId);
  if (data.amount > balance.available) {
    throw new ApiError(400, `Insufficient balance. Available: Rs ${balance.available.toFixed(2)}`);
  }

  const allowed = ['ECOCASH', 'ONEMONEY', 'INNBUCKS', 'BANK'];
  const method = data.method.toUpperCase();
  if (!allowed.includes(method)) {
    throw new ApiError(400, `Method must be one of: ${allowed.join(', ')}`);
  }

  const payout = await prisma.riderPayout.create({
    data: {
      riderId,
      amount: data.amount,
      method,
      accountRef: data.accountRef.trim(),
      accountName: data.accountName?.trim(),
      notes: data.notes?.trim(),
    },
  });

  return payout;
};

export const listPayoutsAdmin = async (status?: string) => {
  const where = status && status !== 'All' ? { status: status as PayoutStatus } : {};
  const payouts = await prisma.riderPayout.findMany({
    where,
    orderBy: { requestedAt: 'desc' },
    include: {
      rider: { select: { id: true, name: true, email: true, phone: true } },
    },
    take: 200,
  });
  return payouts.map((p) => ({
    id: p.id,
    amount: p.amount,
    method: p.method,
    accountRef: p.accountRef,
    accountName: p.accountName,
    status: p.status,
    notes: p.notes,
    adminNotes: p.adminNotes,
    requestedAt: p.requestedAt.toISOString(),
    processedAt: p.processedAt?.toISOString() ?? null,
    rider: p.rider,
  }));
};

export const updatePayoutStatusAdmin = async (
  payoutId: string,
  status: PayoutStatus,
  adminNotes?: string
) => {
  const payout = await prisma.riderPayout.findUnique({ where: { id: payoutId } });
  if (!payout) throw new ApiError(404, 'Payout not found');

  return prisma.riderPayout.update({
    where: { id: payoutId },
    data: {
      status,
      adminNotes: adminNotes ?? payout.adminNotes,
      processedAt: ['PAID', 'REJECTED'].includes(status) ? new Date() : payout.processedAt,
    },
  });
};
