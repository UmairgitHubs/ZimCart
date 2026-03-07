import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';

export const getCategories = async (params: { search?: string; status?: string; storeId?: string, user: any }) => {
  const { search, status, storeId, user } = params;

  const where: any = {};
  
  if (user.role === 'STORE_MANAGER') {
    const store = await prisma.store.findFirst({ where: { managerId: user.id } });
    if (!store) return { items: [], stats: { total: 0, published: 0, draft: 0, hidden: 0 } };
    where.storeId = store.id;
  } else if (storeId) {
    where.storeId = storeId;
  }

  if (status && status !== 'All') {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Pre-calculate Dynamic Statistics based on search results
  // We mirror the store and search filters, but exclude the lifecycle 'status' filter 
  // so the user can see the full breakdown of the result set they've queried.
  const statsWhere: any = { storeId: where.storeId };
  if (where.OR) statsWhere.OR = where.OR;

  const [total, published, draft, hidden] = await Promise.all([
    prisma.category.count({ where: statsWhere }),
    prisma.category.count({ where: { ...statsWhere, status: 'Published' } }),
    prisma.category.count({ where: { ...statsWhere, status: 'Draft' } }),
    prisma.category.count({ where: { ...statsWhere, status: 'Hidden' } })
  ]);

  const categories = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { products: true }
      },
      children: {
        include: {
          _count: { select: { products: true } }
        }
      },
      parentCategory: { select: { id: true, name: true } },
    },
    orderBy: { displayOrder: 'asc' },
  });

  // Map to match frontend Category object
  const mapped = categories.map(cat => {
    // Aggregate recursive product count (direct + children) for a more professional dashboard feel
    const childrenCount = cat.children?.reduce((sum, child) => sum + child._count.products, 0) || 0;
    
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.id,
      description: cat.description || '',
      image: cat.image,
      productCount: cat._count.products + childrenCount,
      status: cat.status as any,
      parentCategoryId: cat.parentCategoryId || undefined,
      parentCategory: cat.parentCategory?.name || undefined,
      lastUpdated: cat.updatedAt ? cat.updatedAt.toISOString() : cat.createdAt.toISOString(),
      displayOrder: cat.displayOrder,
      isFeatured: cat.isFeatured,
    };
  });

  return {
    items: mapped,
    stats: {
      total,
      published,
      draft,
      hidden
    }
  };
};

export const createCategory = async (data: any, user: any) => {
  if (user.role === 'STORE_MANAGER') {
    const store = await prisma.store.findFirst({ where: { managerId: user.id } });
    if (!store) throw new ApiError(403, "Store context not found. Cannot create category.");
    data.storeId = store.id;
  }

  if (!data.storeId) {
    throw new ApiError(400, "Store ID is required");
  }

  const slug = data.slug || slugify(data.name);
  
  // check for duplicate slug
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new ApiError(400, "Category with this slug already exists.");

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      image: data.image,
      status: data.status,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      isFeatured: data.isFeatured || false,
      parentCategoryId: data.parentCategoryId || null,
      storeId: data.storeId,
    }
  });
};

export const updateCategory = async (id: string, data: any, user: any) => {
  const where: any = { id };
  
  if (user.role === 'STORE_MANAGER') {
    const store = await prisma.store.findFirst({ where: { managerId: user.id } });
    if (!store) throw new ApiError(403, "Access denied");
    where.storeId = store.id;
  }

  const existing = await prisma.category.findFirst({ where });
  if (!existing) throw new ApiError(404, "Category not found or access denied");

  if (data.name && !data.slug) {
    data.slug = slugify(data.name);
  }

  if (data.slug && data.slug !== existing.slug) {
     const slugCollision = await prisma.category.findUnique({ where: { slug: data.slug } });
     if (slugCollision && slugCollision.id !== id) {
       throw new ApiError(400, "Category with this slug already exists.");
     }
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      status: data.status,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : undefined,
      isFeatured: data.isFeatured,
      parentCategoryId: data.parentCategoryId || null,
    }
  });
};

export const deleteCategory = async (id: string, user: any) => {
  const where: any = { id };
  
  if (user.role === 'STORE_MANAGER') {
    const store = await prisma.store.findFirst({ where: { managerId: user.id } });
    if (!store) throw new ApiError(403, "Access denied");
    where.storeId = store.id;
  }

  const existing = await prisma.category.findFirst({ 
    where, 
    include: { _count: { select: { products: true, children: true } } } 
  });
  if (!existing) throw new ApiError(404, "Category not found or access denied");
  
  // High-Level Data Integrity: Instead of blocking, we reassign.
  // This is the "Senior Dev" approach - solve the problem for the user.
  
  // 1. Find or create a stable fallback category
  let generalCat = await prisma.category.findFirst({
    where: { 
      storeId: existing.storeId, 
      name: { contains: 'General', mode: 'insensitive' },
      id: { not: id } 
    }
  });

  if (!generalCat) {
    generalCat = await prisma.category.create({
      data: {
        name: "General Ledger",
        slug: `general-fallback-${id.slice(0, 5)}-${Date.now()}`,
        description: "Automated fallback to preserve catalog integrity.",
        storeId: existing.storeId,
        status: 'Published',
        displayOrder: 999
      }
    });
  }

  // 2. Clear all dependencies unconditionally to satisfy foreign key constraints
  await Promise.all([
    prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: generalCat.id }
    }),
    prisma.category.updateMany({
      where: { parentCategoryId: id },
      data: { parentCategoryId: null }
    })
  ]);

  // 4. Finally safe to delete
  await prisma.category.delete({ where: { id } });
  return true;
};
