import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import type { Prisma, StoreStatus } from '@prisma/client';

type StaffUser = { id: string; role: string };

const settingsSelect = {
  id: true,
  name: true,
  image: true,
  description: true,
  rating: true,
  deliveryTime: true,
  minOrder: true,
  deliveryFee: true,
  isActive: true,
  status: true,
  openingHours: true,
  managerId: true,
} satisfies Prisma.StoreSelect;

export async function resolveManagedStoreId(userId: string) {
  const store = await prisma.store.findFirst({
    where: { managerId: userId },
    select: { id: true },
  });
  return store?.id ?? null;
}

export async function getStoreSettingsForStaff(staff: StaffUser, queryStoreId?: string) {
  let storeId: string | null = null;

  if (staff.role === 'STORE_MANAGER') {
    storeId = await resolveManagedStoreId(staff.id);
    if (!storeId) throw new ApiError(403, 'No managed store linked to this account');
  } else if (staff.role === 'ADMIN') {
    if (!queryStoreId) {
      throw new ApiError(400, 'Query parameter storeId is required for admin');
    }
    storeId = queryStoreId;
  } else {
    throw new ApiError(403, 'Not authorized');
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: settingsSelect,
  });
  if (!store) throw new ApiError(404, 'Store not found');
  return store;
}

export async function updateStoreSettingsForStaff(
  staff: StaffUser,
  input: {
    storeId?: string;
    name?: string;
    description?: string | null;
    image?: string | null;
    deliveryTime?: string | null;
    minOrder?: number;
    deliveryFee?: number;
    isActive?: boolean;
    status?: StoreStatus;
    openingHours?: Prisma.InputJsonValue;
  }
) {
  let targetId: string | null = null;

  if (staff.role === 'STORE_MANAGER') {
    targetId = await resolveManagedStoreId(staff.id);
    if (!targetId) throw new ApiError(403, 'No managed store linked to this account');
  } else if (staff.role === 'ADMIN') {
    if (!input.storeId) throw new ApiError(400, 'storeId is required in body for admin');
    targetId = input.storeId;
  } else {
    throw new ApiError(403, 'Not authorized');
  }

  const existing = await prisma.store.findUnique({ where: { id: targetId } });
  if (!existing) throw new ApiError(404, 'Store not found');

  if (staff.role === 'STORE_MANAGER' && existing.managerId !== staff.id) {
    throw new ApiError(403, 'You cannot update this store');
  }

  const { storeId: _sid, ...patch } = input;

  const data: Prisma.StoreUpdateInput = {};
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.image !== undefined) data.image = patch.image;
  if (patch.deliveryTime !== undefined) data.deliveryTime = patch.deliveryTime;
  if (patch.minOrder !== undefined) data.minOrder = patch.minOrder;
  if (patch.deliveryFee !== undefined) data.deliveryFee = patch.deliveryFee;
  if (patch.isActive !== undefined) data.isActive = patch.isActive;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.openingHours !== undefined) data.openingHours = patch.openingHours as Prisma.InputJsonValue;

  return prisma.store.update({
    where: { id: targetId },
    data,
    select: settingsSelect,
  });
}

/** Customer-facing discovery: only marts that are on and accepting traffic (not CLOSED/HIDDEN). */
const publicMartDiscoveryWhere: Prisma.StoreWhereInput = {
  isActive: true,
  status: { in: ['OPEN', 'BUSY'] },
};

export const getAllMarts = async () => {
  const stores = await prisma.store.findMany({
    where: publicMartDiscoveryWhere,
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
      rating: true,
      deliveryTime: true,
      deliveryFee: true,
      minOrder: true,
      status: true,
      categories: {
        take: 3,
        select: { name: true }
      }
    }
  });

  return stores.map(s => ({
    ...s,
    tags: s.categories.map(c => c.name),
    deliveryFee: `Rs. ${s.deliveryFee}`,
    minOrder: `Rs. ${s.minOrder || 0}`
  }));
};

/** Full mart list for admin tooling (e.g. settings picker), including inactive or HIDDEN. */
export async function getMartsDirectoryForAdmin() {
  return prisma.store.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      status: true,
      isActive: true,
    },
  });
}

export const getMartById = async (id: string, search?: string, category?: string) => {
  const storeBaseWhere: Prisma.StoreWhereInput = {
    id,
    ...publicMartDiscoveryWhere,
  };

  const productWhere: any = {
    storeId: id,
    status: { not: 'Draft' },
  };
  
  if (search) {
    productWhere.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (category && category !== 'All') {
    productWhere.category = {
      name: { equals: category, mode: 'insensitive' }
    };
  }

  // Senior Developer Practice: Defensive Inclusion
  // If the Prisma Client is out of sync with the DB (common during fast iterations),
  // we attempt the full join but handle failure gracefully to ensure products still show.
  try {
    const store = await prisma.store.findFirst({
      where: storeBaseWhere,
      include: {
        categories: {
          include: {
            _count: { select: { products: true } }
          }
        },
        vouchers: {
          where: { isActive: true },
          take: 3
        },
        products: {
          where: productWhere,
          include: {
            category: { select: { name: true } }
          },
          take: 100,
          orderBy: { sales: 'desc' }
        }
      }
    });
    return store;
  } catch (error) {
    console.error("[Store Service] Rich fetch failed, falling back to basic fetch:", error);
    // Fallback: Fetch without vouchers to unblock product display
    return prisma.store.findFirst({
      where: storeBaseWhere,
      include: {
        categories: true,
        products: {
          where: productWhere,
          include: { category: { select: { name: true } } },
          take: 50
        }
      }
    });
  }
};
