import { prisma } from '../config/db.js';
import { buildOrderTrackingUrl } from '../utils/tracking.js';
import { emitToCustomer } from '../utils/customerSocket.js';
import * as notificationService from './notification.service.js';
import type { OrderStatus } from '@prisma/client';

const STATUS_MESSAGES: Partial<Record<OrderStatus, { title: string; body: string }>> = {
  CONFIRMED: {
    title: 'Order confirmed',
    body: 'Your order has been confirmed and is being prepared.',
  },
  PREPARING: {
    title: 'Order preparing',
    body: 'The store is preparing your items.',
  },
  SHIPPING: {
    title: 'Out for delivery',
    body: 'Your order is on the way. Tap to track live.',
  },
  COMPLETED: {
    title: 'Delivered',
    body: 'Your order has been delivered. Enjoy!',
  },
  CANCELLED: {
    title: 'Order cancelled',
    body: 'Your order was cancelled. Contact support if you need help.',
  },
};

export async function ensureOrderTrackingUrl(orderId: string): Promise<string> {
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    select: { trackingUrl: true },
  });
  if (existing?.trackingUrl) return existing.trackingUrl;

  const url = buildOrderTrackingUrl(orderId);
  await prisma.order.update({
    where: { id: orderId },
    data: { trackingUrl: url },
  });
  return url;
}

export async function notifyCustomerOrderUpdate(
  userId: string,
  order: { id: string; orderNumber: string; status: OrderStatus },
  override?: { title: string; body: string }
) {
  const msg =
    override ??
    STATUS_MESSAGES[order.status] ?? {
      title: 'Order update',
      body: `Order ${order.orderNumber} status: ${order.status}`,
    };

  await notificationService
    .sendNotification([userId], msg.title, msg.body, {
      type: 'ORDER',
      orderId: order.id,
      status: order.status,
    })
    .catch((err) => console.error('Customer order notification failed:', err));

  emitToCustomer(userId, 'order:updated', {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
  });
}

export async function onRiderAssigned(
  order: { id: string; orderNumber: string; userId: string; status: OrderStatus }
) {
  await ensureOrderTrackingUrl(order.id);
  await notifyCustomerOrderUpdate(order.userId, order, {
    title: 'Rider assigned',
    body: `A rider is assigned to ${order.orderNumber}. You can track delivery in the app.`,
  });
}

export async function onOrderStatusChanged(
  order: { id: string; orderNumber: string; userId: string; status: OrderStatus }
) {
  if (order.status === 'SHIPPING') {
    await ensureOrderTrackingUrl(order.id);
  }
  await notifyCustomerOrderUpdate(order.userId, order);
}
