import prisma from '../config/db.js';
import type { ProductInput } from '../validators/product.schema.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

const getEffectiveStoreId = async (providedId?: string, managerId?: string) => {
  if (providedId) return providedId;
  
  // High-fidelity resolution for STORE_MANAGERS: Find their specific linked store
  if (managerId) {
    const store = await prisma.store.findFirst({
      where: { managerId }
    });
    if (store) return store.id;
  }

  // Fallback for system-wide operations (Beta/Admin mode)
  const store = await prisma.store.findFirst();
  if (!store) throw new ApiError(400, "Store context not found. Please create a store first.");
  return store.id;
};

export const createProduct = async (data: ProductInput, managerId?: string) => {
  try {
    const storeId = await getEffectiveStoreId(undefined, managerId);

    // 1. Resolve Hierarchy: Find the most specific category
    let targetCategoryId: string;

    // First find parent category
    let parentCategory = await prisma.category.findFirst({
      where: { name: data.category, storeId }
    });

    if (!parentCategory) {
      parentCategory = await prisma.category.create({
        data: {
          name: data.category,
          storeId,
          image: data.images[0] || null,
          status: 'Published'
        }
      });
    }

    targetCategoryId = parentCategory.id;

    // Check if subCategory is actually a real Category in DB
    if (data.subCategory) {
      let subCategory = await prisma.category.findFirst({
        where: { 
          name: data.subCategory, 
          parentCategoryId: parentCategory.id,
          storeId
        }
      });

      if (subCategory) {
        targetCategoryId = subCategory.id;
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        description: data.description,
        images: data.images,
        price: data.price,
        discountPrice: data.discountPrice,
        costPrice: data.costPrice,
        taxPercentage: data.taxPercentage,
        sku: data.sku,
        barcode: data.barcode,
        inventory: data.inventory,
        status: data.status,
        subCategory: data.subCategory,
        isDeal: data.isDeal,
        discountPercentage: data.discountPercentage,
        weight: data.weight,
        sales: data.sales,
        variants: data.variants as any,
        categoryId: targetCategoryId,
        storeId,
        history: {
          create: {
            event: "Protocol Initiated",
            description: "Product listing added to ZimCart fleet."
          }
        }
      }
    });

    return product;
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new ApiError(400, 'A product with this SKU already exists');
    }
    logger.error('Product Creation Service Error:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<ProductInput>, managerId?: string) => {
  try {
    const storeId = await getEffectiveStoreId(undefined, managerId);
    let targetCategoryId: string | undefined;

    // 1. Resolve Hierarchy if category changed
    if (data.category) {
      let parentCategory = await prisma.category.findFirst({
        where: { name: data.category, storeId }
      });

      if (!parentCategory) {
        parentCategory = await prisma.category.create({
          data: { name: data.category, storeId, status: 'Published' }
        });
      }
      
      targetCategoryId = parentCategory.id;

      // Handle sub-category if provided
      if (data.subCategory) {
        const subCat = await prisma.category.findFirst({
          where: { name: data.subCategory, parentCategoryId: parentCategory.id, storeId }
        });
        if (subCat) targetCategoryId = subCat.id;
      }
    }

    // 2. Build sanitized update payload (Skip 'category' string, use 'categoryId')
    const { category, ...rest } = data;
    
    const updateData: { [key: string]: any } = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined)
    );

    if (targetCategoryId) {
      updateData.categoryId = targetCategoryId;
    }

    // 3. Get old data for history comparison
    const oldProduct = await prisma.product.findUnique({ where: { id } });

    // 4. Update with Security Guard
    const product = await prisma.product.update({
      where: { 
        id,
        storeId 
      },
      data: updateData
    });

    // 5. Record History if significant changes occurred
    if (oldProduct) {
      if (updateData.inventory !== undefined && updateData.inventory !== oldProduct.inventory) {
        await prisma.productHistory.create({
          data: {
            productId: id,
            event: "Inventory Alignment",
            description: `Manual stock adjustment confirmed (${updateData.inventory - oldProduct.inventory > 0 ? '+' : ''}${updateData.inventory - oldProduct.inventory} units).`,
            metadata: { old: oldProduct.inventory, new: updateData.inventory }
          }
        });
      }
      if (updateData.price !== undefined && updateData.price !== oldProduct.price) {
        await prisma.productHistory.create({
          data: {
            productId: id,
            event: "Price Vector Optimized",
            description: "Pricing model updated for seasonal performance.",
            metadata: { old: oldProduct.price, new: updateData.price }
          }
        });
      }
    }

    return product;
  } catch (error: any) {
    logger.error('Product Update Service Error:', error);
    throw error;
  }
};

export const getProducts = async (page: number = 1, limit: number = 20, filters?: { search?: string | undefined; category?: string | undefined; status?: string | undefined; storeId?: string; managerId?: string | undefined }) => {
  const skip = (page - 1) * limit;
  const storeId = await getEffectiveStoreId(filters?.storeId, filters?.managerId);
  
  const where: any = { storeId };
  
  if (filters?.status && filters.status !== 'All') {
    where.status = filters.status;
  }

  if (filters?.category && filters.category !== 'All Categories') {
    where.category = {
      name: filters.category
    };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { brand: { contains: filters.search, mode: 'insensitive' } },
      { sku: { contains: filters.search, mode: 'insensitive' } },
      { category: { name: { contains: filters.search, mode: 'insensitive' } } }
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      history: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

export const deleteProduct = async (id: string, managerId?: string) => {
  try {
    const storeId = await getEffectiveStoreId(undefined, managerId);

    // 1. Check existence and ownership
    const product = await prisma.product.findFirst({
      where: { id, storeId }
    });

    if (!product) {
      throw new ApiError(404, "Product not found or access denied");
    }

    // 2. Atomic deletion (this will also delete history if cascade is set, or we handle it manually)
    // Note: Depends on Prisma schema version and cascade settings. 
    // Usually, we want to clear related records first or use a transaction.
    return await prisma.$transaction(async (tx) => {
      // Clear associated history first
      await tx.productHistory.deleteMany({ where: { productId: id } });
      
      // Delete the core product
      return await tx.product.delete({
        where: { id }
      });
    });
  } catch (error: any) {
    logger.error('Product Deletion Service Error:', error);
    throw error;
  }
};
