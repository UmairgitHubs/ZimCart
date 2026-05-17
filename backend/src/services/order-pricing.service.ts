import type { DiscountType, Prisma } from '@prisma/client';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ORDER_PLATFORM_FEE } from '../constants/order.js';

async function resolveVoucherForCheckout(userId: string, code: string) {
  const voucher = await prisma.voucher.findUnique({
    where: { code: code.toUpperCase() },
  });
  if (!voucher) {
    throw new ApiError(404, 'Invalid voucher code');
  }
  if (!voucher.isActive || new Date(voucher.expiryDate) < new Date()) {
    throw new ApiError(400, 'This voucher has expired or is no longer active');
  }
  const userVoucher = await prisma.userVoucher.findUnique({
    where: { userId_voucherId: { userId, voucherId: voucher.id } },
  });
  if (userVoucher?.isUsed) {
    throw new ApiError(400, 'You have already used this voucher');
  }
  return voucher;
}

export type OrderLineInput = { productId: string; quantity: number };

export type ResolvedOrderLine = {
  productId: string;
  quantity: number;
  price: number;
  total: number;
  name: string;
};

export type OrderTotalsPreview = {
  storeId: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  items: ResolvedOrderLine[];
  voucherApplied: boolean;
};

function computeVoucherDiscountAmount(
  voucher: { discountType: DiscountType; value: number; maxDiscount: number | null },
  subtotal: number
): number {
  if (voucher.discountType === 'FIXED') {
    return Math.min(voucher.value, subtotal);
  }
  const pct = (subtotal * voucher.value) / 100;
  if (voucher.maxDiscount != null && voucher.maxDiscount > 0) {
    return Math.min(pct, voucher.maxDiscount, subtotal);
  }
  return Math.min(pct, subtotal);
}

type TxClient = Prisma.TransactionClient | typeof prisma;

async function resolveLines(
  db: TxClient,
  storeId: string,
  items: OrderLineInput[]
): Promise<ResolvedOrderLine[]> {
  if (!items?.length) {
    throw new ApiError(400, 'Order must include at least one item');
  }

  const lines: ResolvedOrderLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      throw new ApiError(400, 'Invalid item quantity');
    }

    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { id: true, name: true, price: true, storeId: true },
    });

    if (!product) {
      throw new ApiError(400, `Product not found: ${item.productId}`);
    }
    if (product.storeId !== storeId) {
      throw new ApiError(400, 'Cart contains items from a different store');
    }

    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    lines.push({
      productId: product.id,
      quantity: qty,
      price: product.price,
      total: lineTotal,
      name: product.name,
    });
  }

  return lines;
}

export async function computeOrderTotals(
  userId: string,
  params: {
    storeId: string;
    items: OrderLineInput[];
    deliveryFee?: number;
    voucherCode?: string;
  }
): Promise<OrderTotalsPreview> {
  const { storeId, items, deliveryFee: clientDeliveryFee, voucherCode: rawCode } = params;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true, deliveryFee: true, isActive: true },
  });
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }
  if (!store.isActive) {
    throw new ApiError(400, 'This store is not accepting orders');
  }

  const lines = await resolveLines(prisma, storeId, items);
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);

  const deliveryFee =
    subtotal === 0
      ? 0
      : clientDeliveryFee != null && Number.isFinite(Number(clientDeliveryFee))
        ? Number(clientDeliveryFee)
        : store.deliveryFee;

  const platformFee = subtotal === 0 ? 0 : ORDER_PLATFORM_FEE;

  const voucherCode =
    typeof rawCode === 'string' && rawCode.trim() ? rawCode.trim().toUpperCase() : '';

  let discount = 0;
  if (voucherCode) {
    const voucher = await resolveVoucherForCheckout(userId, voucherCode);
    const minSpend = voucher.minSpend ?? 0;
    if (subtotal < minSpend) {
      throw new ApiError(400, `This voucher requires a minimum spend of Rs. ${minSpend}`);
    }
    discount = computeVoucherDiscountAmount(voucher, subtotal);
  }

  const total = Math.max(0, subtotal + deliveryFee + platformFee - discount);

  return {
    storeId,
    subtotal,
    deliveryFee,
    platformFee,
    discount,
    total,
    items: lines,
    voucherApplied: !!voucherCode && discount > 0,
  };
}

export async function assertOrderTotalsMatch(
  userId: string,
  data: {
    storeId: string;
    items: OrderLineInput[];
    subtotal: number;
    deliveryFee: number;
    discount?: number;
    total: number;
    voucherCode?: string;
  }
): Promise<OrderTotalsPreview> {
  const computed = await computeOrderTotals(userId, {
    storeId: data.storeId,
    items: data.items,
    deliveryFee: data.deliveryFee,
    ...(data.voucherCode ? { voucherCode: data.voucherCode } : {}),
  });

  if (Math.abs(computed.subtotal - Number(data.subtotal)) > 0.02) {
    throw new ApiError(400, 'Subtotal mismatch. Refresh your cart and try again.');
  }
  if (Math.abs(computed.deliveryFee - Number(data.deliveryFee)) > 0.02) {
    throw new ApiError(400, 'Delivery fee mismatch. Refresh your cart and try again.');
  }
  if (Math.abs(computed.discount - Number(data.discount || 0)) > 0.02) {
    throw new ApiError(400, 'Discount mismatch. Re-apply your voucher and try again.');
  }
  if (Math.abs(computed.total - Number(data.total)) > 0.05) {
    throw new ApiError(400, 'Order total mismatch. Refresh your cart and try again.');
  }

  return computed;
}

export { resolveLines, computeVoucherDiscountAmount, ORDER_PLATFORM_FEE };
