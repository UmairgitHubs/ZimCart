import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import type { Prisma, WasteReason } from '@prisma/client';

type StaffUser = { id: string; role: string };

async function resolveStoreId(user: StaffUser, queryStoreId?: string): Promise<string | null> {
  if (user.role === 'ADMIN') {
    return queryStoreId ?? null;
  }
  if (user.role === 'STORE_MANAGER') {
    const store = await prisma.store.findFirst({
      where: { managerId: user.id },
      select: { id: true },
    });
    if (!store) throw new ApiError(403, 'No managed store');
    if (queryStoreId && queryStoreId !== store.id) {
      throw new ApiError(403, 'You can only manage your own store');
    }
    return store.id;
  }
  throw new ApiError(403, 'Not authorized');
}

async function assertProductInScope(productId: string, storeId: string | null) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: { select: { name: true } } },
  });
  if (!product) throw new ApiError(404, 'Product not found');
  if (storeId && product.storeId !== storeId) {
    throw new ApiError(403, 'Product is outside your store scope');
  }
  return product;
}

function mapRow(row: {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalLoss: number;
  reason: WasteReason;
  notes: string | null;
  imageUrl: string | null;
  createdAt: Date;
  product: { name: string; sku: string; category: { name: string } };
  loggedBy: { name: string };
}) {
  return {
    id: row.id,
    productId: row.productId,
    productName: row.product.name,
    sku: row.product.sku,
    category: row.product.category.name,
    quantity: row.quantity,
    unitCost: row.unitCost,
    totalLoss: row.totalLoss,
    reason: row.reason,
    loggedBy: row.loggedBy.name,
    timestamp: row.createdAt.toISOString(),
    notes: row.notes ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
  };
}

const include = {
  product: { include: { category: { select: { name: true } } } },
  loggedBy: { select: { name: true } },
} as const;

export async function listWasteLogs(
  user: StaffUser,
  opts: {
    storeId?: string;
    reason?: WasteReason;
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }
) {
  const scopedStoreId = await resolveStoreId(user, opts.storeId);
  const page = opts.page ?? 1;
  const limit = Math.min(100, opts.limit ?? 50);
  const skip = (page - 1) * limit;

  const where: Prisma.WasteLogWhereInput = {};
  if (scopedStoreId) where.storeId = scopedStoreId;
  if (opts.reason) where.reason = opts.reason;
  if (opts.from || opts.to) {
    where.createdAt = {};
    if (opts.from) where.createdAt.gte = new Date(opts.from);
    if (opts.to) where.createdAt.lte = new Date(opts.to);
  }
  if (opts.search?.trim()) {
    const q = opts.search.trim();
    where.OR = [
      { product: { name: { contains: q, mode: 'insensitive' } } },
      { product: { sku: { contains: q, mode: 'insensitive' } } },
      { notes: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.wasteLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include,
    }),
    prisma.wasteLog.count({ where }),
  ]);

  return {
    logs: rows.map(mapRow),
    pagination: { total, page, pages: Math.ceil(total / limit) || 1 },
  };
}

export async function createWasteLog(
  user: StaffUser,
  input: {
    productId: string;
    quantity: number;
    reason: WasteReason;
    notes?: string;
    imageUrl?: string;
    unitCost?: number;
  }
) {
  const scopedStoreId = await resolveStoreId(user);
  const product = await assertProductInScope(input.productId, scopedStoreId);
  const storeId = scopedStoreId ?? product.storeId;

  if (product.inventory < input.quantity) {
    throw new ApiError(400, 'Insufficient stock to write off this quantity');
  }

  const unitCost = input.unitCost ?? product.costPrice ?? product.price;
  const totalLoss = unitCost * input.quantity;
  const nextStock = product.inventory - input.quantity;

  const row = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: product.id },
      data: {
        inventory: nextStock,
        history: {
          create: {
            event: 'Waste Write-Off',
            description: input.notes || `Waste: ${input.reason}`,
            metadata: { old: product.inventory, new: nextStock, reason: input.reason },
          },
        },
      },
    });

    return tx.wasteLog.create({
      data: {
        storeId,
        productId: product.id,
        quantity: input.quantity,
        unitCost,
        totalLoss,
        reason: input.reason,
        notes: input.notes,
        imageUrl: input.imageUrl,
        loggedById: user.id,
      },
      include,
    });
  });

  return mapRow(row);
}

export async function updateWasteLog(
  user: StaffUser,
  id: string,
  input: {
    quantity?: number;
    reason?: WasteReason;
    notes?: string;
    imageUrl?: string | null;
    unitCost?: number;
  }
) {
  const scopedStoreId = await resolveStoreId(user);
  const existing = await prisma.wasteLog.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!existing) throw new ApiError(404, 'Waste log not found');
  if (scopedStoreId && existing.storeId !== scopedStoreId) {
    throw new ApiError(403, 'Access denied');
  }

  const newQty = input.quantity ?? existing.quantity;
  const delta = newQty - existing.quantity;
  if (delta > 0 && existing.product.inventory < delta) {
    throw new ApiError(400, 'Insufficient stock for increased write-off quantity');
  }

  const unitCost = input.unitCost ?? existing.unitCost;
  const totalLoss = unitCost * newQty;
  const nextStock = existing.product.inventory - delta;

  const row = await prisma.$transaction(async (tx) => {
    if (delta !== 0) {
      await tx.product.update({
        where: { id: existing.productId },
        data: {
          inventory: nextStock,
          history: {
            create: {
              event: 'Waste Correction',
              description: `Adjusted waste log ${id}`,
              metadata: { old: existing.product.inventory, new: nextStock, delta },
            },
          },
        },
      });
    }

    return tx.wasteLog.update({
      where: { id },
      data: {
        ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
        ...(input.reason !== undefined ? { reason: input.reason } : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
        unitCost,
        totalLoss,
      },
      include,
    });
  });

  return mapRow(row);
}

export async function deleteWasteLog(user: StaffUser, id: string) {
  const scopedStoreId = await resolveStoreId(user);
  const existing = await prisma.wasteLog.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!existing) throw new ApiError(404, 'Waste log not found');
  if (scopedStoreId && existing.storeId !== scopedStoreId) {
    throw new ApiError(403, 'Access denied');
  }

  await prisma.$transaction(async (tx) => {
    const nextStock = existing.product.inventory + existing.quantity;
    await tx.product.update({
      where: { id: existing.productId },
      data: {
        inventory: nextStock,
        history: {
          create: {
            event: 'Waste Reversal',
            description: `Reversed waste log ${id}`,
            metadata: { old: existing.product.inventory, new: nextStock },
          },
        },
      },
    });
    await tx.wasteLog.delete({ where: { id } });
  });

  return { deleted: true };
}
