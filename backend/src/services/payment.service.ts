import type { PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const getEffectiveStoreId = async (managerId: string) => {
  const store = await prisma.store.findFirst({ where: { managerId } });
  return store?.id;
};

export function isCashOnDelivery(method: string): boolean {
  const m = method.toLowerCase();
  return m.includes('cash') || m.includes('cod') || m.includes('doorstep');
}

export function initialPaymentStatus(paymentMethod: string): PaymentStatus {
  return 'PENDING';
}

export async function createPaymentForOrder(
  tx: Prisma.TransactionClient,
  order: { id: string; total: number; paymentMethod: string }
) {
  return tx.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      currency: 'USD',
      method: order.paymentMethod,
      status: initialPaymentStatus(order.paymentMethod),
      provider: isCashOnDelivery(order.paymentMethod) ? 'COD' : 'MANUAL',
    },
  });
}

export async function syncPaymentWithOrderStatus(orderId: string, orderStatus: string) {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) return;

  if (orderStatus === 'CANCELLED' && payment.status !== 'REFUNDED') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'CANCELLED' },
    });
    return;
  }

  if (
    orderStatus === 'COMPLETED' &&
    isCashOnDelivery(payment.method) &&
    payment.status === 'PENDING'
  ) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID', paidAt: new Date() },
    });
  }
}

function mapPaymentToUiStatus(status: PaymentStatus): 'Completed' | 'Pending' | 'Failed' | 'Refunded' {
  switch (status) {
    case 'PAID':
      return 'Completed';
    case 'FAILED':
      return 'Failed';
    case 'REFUNDED':
    case 'CANCELLED':
      return 'Refunded';
    default:
      return 'Pending';
  }
}

function mapUiStatusToPayment(status: string): PaymentStatus {
  switch (status) {
    case 'Completed':
      return 'PAID';
    case 'Failed':
      return 'FAILED';
    case 'Refunded':
      return 'REFUNDED';
    default:
      return 'PENDING';
  }
}

export const listPayments = async (
  user: { id: string; role: string },
  query: { status?: string; search?: string; page?: number; limit?: number }
) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
  const skip = (page - 1) * limit;

  const orderWhere: Prisma.OrderWhereInput = {};

  if (user.role === 'STORE_MANAGER') {
    const storeId = await getEffectiveStoreId(user.id);
    if (!storeId) {
      return { payments: [], pagination: { total: 0, page, pages: 0 } };
    }
    orderWhere.storeId = storeId;
  }

  const paymentWhere: Prisma.PaymentWhereInput = {
    order: orderWhere,
  };

  if (query.status && query.status !== 'All') {
    paymentWhere.status = mapUiStatusToPayment(query.status);
  }

  if (query.search?.trim()) {
    const term = query.search.trim();
    paymentWhere.OR = [
      { id: { contains: term, mode: 'insensitive' } },
      { order: { orderNumber: { contains: term, mode: 'insensitive' } } },
      { order: { user: { name: { contains: term, mode: 'insensitive' } } } },
      { order: { user: { email: { contains: term, mode: 'insensitive' } } } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.payment.findMany({
      where: paymentWhere,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            store: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.payment.count({ where: paymentWhere }),
  ]);

  const payments = rows.map((p) => ({
    id: p.id,
    orderId: p.order.id,
    orderNumber: p.order.orderNumber,
    customerName: p.order.user.name,
    customerEmail: p.order.user.email,
    storeName: p.order.store.name,
    amount: p.amount,
    currency: p.currency as 'USD' | 'ZiG',
    status: mapPaymentToUiStatus(p.status),
    paymentStatus: p.status,
    paymentMethod: p.method,
    timestamp: p.createdAt.toISOString(),
    reference: p.order.orderNumber,
    paidAt: p.paidAt?.toISOString() ?? null,
    adminNotes: p.adminNotes,
    provider: p.provider,
    providerRef: p.providerRef,
  }));

  return {
    payments,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 0,
    },
  };
};

export const reconcilePayment = async (
  paymentId: string,
  user: { id: string; role: string },
  adminNotes?: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });
  if (!payment) throw new ApiError(404, 'Payment not found');

  if (user.role === 'STORE_MANAGER') {
    const storeId = await getEffectiveStoreId(user.id);
    if (!storeId || payment.order.storeId !== storeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  if (payment.status === 'PAID') {
    return payment;
  }
  if (payment.status === 'CANCELLED' || payment.status === 'REFUNDED') {
    throw new ApiError(400, 'Cannot reconcile a cancelled or refunded payment');
  }

  const data: Prisma.PaymentUpdateInput = {
    status: 'PAID',
    paidAt: new Date(),
  };
  if (adminNotes !== undefined) data.adminNotes = adminNotes;

  return prisma.payment.update({
    where: { id: paymentId },
    data,
  });
};

export const updatePaymentStatus = async (
  paymentId: string,
  user: { id: string; role: string },
  payload: { status: string; adminNotes?: string }
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });
  if (!payment) throw new ApiError(404, 'Payment not found');

  if (user.role === 'STORE_MANAGER') {
    const storeId = await getEffectiveStoreId(user.id);
    if (!storeId || payment.order.storeId !== storeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  const nextStatus = mapUiStatusToPayment(payload.status);
  const data: Prisma.PaymentUpdateInput = {
    status: nextStatus,
    ...(payload.adminNotes !== undefined ? { adminNotes: payload.adminNotes } : {}),
  };

  if (nextStatus === 'PAID') {
    data.paidAt = new Date();
  }
  if (nextStatus === 'PENDING') {
    data.paidAt = null;
  }

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data,
  });

  if (nextStatus === 'REFUNDED' || nextStatus === 'CANCELLED') {
    if (payment.order.status !== 'CANCELLED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CANCELLED' },
      });
    }
  }

  return updated;
};

export const deletePaymentAndOrder = async (
  paymentId: string,
  user: { id: string; role: string }
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });
  if (!payment) throw new ApiError(404, 'Payment not found');

  if (user.role === 'STORE_MANAGER') {
    const storeId = await getEffectiveStoreId(user.id);
    if (!storeId || payment.order.storeId !== storeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  await prisma.order.delete({ where: { id: payment.orderId } });
  return true;
};

export { mapPaymentToUiStatus, mapUiStatusToPayment };
