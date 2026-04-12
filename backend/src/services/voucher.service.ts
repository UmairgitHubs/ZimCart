import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import type { DiscountType } from '@prisma/client';

type StaffUser = { id: string; role: string };

async function getStaffContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      managedStore: { select: { id: true } },
    },
  });
  if (!user) throw new ApiError(401, 'User not found');
  return user;
}

export async function assertCanAccessVoucher(voucherId: string, staff: StaffUser) {
  const voucher = await prisma.voucher.findUnique({
    where: { id: voucherId },
    select: { id: true, storeId: true },
  });
  if (!voucher) throw new ApiError(404, 'Voucher not found');

  if (staff.role === 'ADMIN') return voucher;

  if (staff.role === 'STORE_MANAGER') {
    const ctx = await getStaffContext(staff.id);
    const sid = ctx.managedStore?.id;
    if (!sid) throw new ApiError(403, 'No managed store');
    if (voucher.storeId === sid) return voucher;
    throw new ApiError(403, 'You cannot manage this voucher');
  }

  throw new ApiError(403, 'Not authorized');
}

export function packDescription(name: string, description?: string | null) {
  const n = name.trim();
  const d = (description ?? '').trim();
  if (!d) return n;
  return `${n}\n${d}`;
}

export function unpackVoucherDescription(raw: string | null, code: string) {
  if (!raw) return { name: code, description: '' };
  const i = raw.indexOf('\n');
  if (i === -1) return { name: raw.trim() || code, description: '' };
  return { name: raw.slice(0, i).trim() || code, description: raw.slice(i + 1).trim() };
}

export async function listVouchers(staff: StaffUser, search?: string) {
  const ctx = await getStaffContext(staff.id);
  if (ctx.role === 'STORE_MANAGER' && !ctx.managedStore?.id) {
    return [];
  }
  if (ctx.role !== 'ADMIN' && ctx.role !== 'STORE_MANAGER') {
    throw new ApiError(403, 'Not authorized to manage vouchers');
  }

  const parts: object[] = [];
  if (ctx.role === 'STORE_MANAGER' && ctx.managedStore?.id) {
    parts.push({ storeId: ctx.managedStore.id });
  }

  if (search?.trim()) {
    const q = search.trim();
    parts.push({
      OR: [
        { code: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    });
  }

  const where = parts.length ? { AND: parts } : {};

  const vouchers = await prisma.voucher.findMany({
    where,
    include: {
      store: { select: { id: true, name: true } },
    },
    orderBy: { expiryDate: 'desc' },
  });

  const ids = vouchers.map((v) => v.id);
  const usedAgg =
    ids.length === 0
      ? []
      : await prisma.userVoucher.groupBy({
          by: ['voucherId'],
          where: { voucherId: { in: ids }, isUsed: true },
          _count: { id: true },
        });
  const usedMap = Object.fromEntries(usedAgg.map((r) => [r.voucherId, r._count.id]));

  return vouchers.map((v) => {
    const { name, description } = unpackVoucherDescription(v.description, v.code);
    return {
      ...v,
      campaignName: name,
      campaignDescription: description,
      usageCount: usedMap[v.id] ?? 0,
    };
  });
}

type CreateInput = {
  code: string;
  name: string;
  description?: string | null;
  discountType: DiscountType;
  value: number;
  minSpend?: number | null;
  maxDiscount?: number | null;
  expiryDate: string;
  isActive?: boolean;
  storeId?: string | null;
};

export async function createVoucher(staff: StaffUser, input: CreateInput) {
  const ctx = await getStaffContext(staff.id);
  const code = input.code.trim().toUpperCase();
  if (input.discountType === 'PERCENTAGE' && input.value > 100) {
    throw new ApiError(400, 'Percentage discount cannot exceed 100');
  }

  let storeId: string | null = null;
  if (ctx.role === 'STORE_MANAGER') {
    if (!ctx.managedStore?.id) throw new ApiError(403, 'No managed store');
    storeId = ctx.managedStore.id;
  } else if (ctx.role === 'ADMIN') {
    storeId = input.storeId ?? null;
  }

  const description = packDescription(input.name, input.description);

  try {
    return await prisma.voucher.create({
      data: {
        code,
        description,
        discountType: input.discountType,
        value: input.value,
        minSpend: input.minSpend ?? null,
        maxDiscount: input.maxDiscount ?? null,
        expiryDate: new Date(input.expiryDate),
        isActive: input.isActive ?? true,
        storeId,
      },
      include: { store: { select: { id: true, name: true } } },
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
      throw new ApiError(409, 'A voucher with this code already exists');
    }
    throw e;
  }
}

type UpdateInput = Partial<{
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  value: number;
  minSpend: number | null;
  maxDiscount: number | null;
  expiryDate: string;
  isActive: boolean;
  storeId: string | null;
}>;

export async function updateVoucher(voucherId: string, staff: StaffUser, input: UpdateInput) {
  await assertCanAccessVoucher(voucherId, staff);
  const existing = await prisma.voucher.findUnique({ where: { id: voucherId } });
  if (!existing) throw new ApiError(404, 'Voucher not found');

  const ctx = await getStaffContext(staff.id);
  const { name: currentName, description: currentDesc } = unpackVoucherDescription(
    existing.description,
    existing.code
  );

  const nextName = input.name !== undefined ? input.name : currentName;
  const nextDesc = input.description !== undefined ? input.description : currentDesc;
  const description =
    input.name !== undefined || input.description !== undefined
      ? packDescription(nextName, nextDesc)
      : undefined;

  const code = input.code !== undefined ? input.code.trim().toUpperCase() : undefined;
  if (input.discountType === 'PERCENTAGE' && input.value !== undefined && input.value > 100) {
    throw new ApiError(400, 'Percentage discount cannot exceed 100');
  }
  const discountType = input.discountType ?? existing.discountType;
  const value = input.value ?? existing.value;
  if (discountType === 'PERCENTAGE' && value > 100) {
    throw new ApiError(400, 'Percentage discount cannot exceed 100');
  }

  let storeId: string | null | undefined = undefined;
  if (ctx.role === 'ADMIN' && input.storeId !== undefined) {
    storeId = input.storeId;
  }

  try {
    return await prisma.voucher.update({
      where: { id: voucherId },
      data: {
        ...(code !== undefined ? { code } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(input.discountType !== undefined ? { discountType: input.discountType } : {}),
        ...(input.value !== undefined ? { value: input.value } : {}),
        ...(input.minSpend !== undefined ? { minSpend: input.minSpend } : {}),
        ...(input.maxDiscount !== undefined ? { maxDiscount: input.maxDiscount } : {}),
        ...(input.expiryDate !== undefined ? { expiryDate: new Date(input.expiryDate) } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        ...(storeId !== undefined ? { storeId } : {}),
      },
      include: { store: { select: { id: true, name: true } } },
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
      throw new ApiError(409, 'A voucher with this code already exists');
    }
    throw e;
  }
}

export async function deleteVoucher(voucherId: string, staff: StaffUser) {
  await assertCanAccessVoucher(voucherId, staff);
  await prisma.userVoucher.deleteMany({ where: { voucherId } });
  await prisma.voucher.delete({ where: { id: voucherId } });
}

export async function countVoucherRedemptions(voucherId: string) {
  return prisma.userVoucher.count({ where: { voucherId, isUsed: true } });
}
