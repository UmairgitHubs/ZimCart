import prisma from '../config/db.js';
import type { ProductInput } from '../validators/product.schema.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

const DEFAULT_STORE_ID = 'f8d7b3a9-1c9d-4e2b-8a1d-9c3f4e5d6a7b';

export const createProduct = async (data: ProductInput) => {
  try {
    let category = await prisma.category.findFirst({
      where: { name: data.category, storeId: DEFAULT_STORE_ID }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: data.category,
          storeId: DEFAULT_STORE_ID,
          image: data.images[0] || null
        }
      });
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
        categoryId: category.id,
        storeId: DEFAULT_STORE_ID,
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

export const updateProduct = async (id: string, data: Partial<ProductInput>) => {
  try {
    let categoryId: string | undefined;

    // 1. Resolve Category if provided
    if (data.category) {
      let category = await prisma.category.findFirst({
        where: { name: data.category, storeId: DEFAULT_STORE_ID }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: data.category,
            storeId: DEFAULT_STORE_ID
          }
        });
      }
      categoryId = category.id;
    }

    // 2. Build sanitized update payload (Skip 'category' string, use 'categoryId')
    const { category, ...rest } = data;
    
    const updateData: { [key: string]: any } = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined)
    );

    if (categoryId) {
      updateData.categoryId = categoryId;
    }

    // 3. Get old data for history comparison
    const oldProduct = await prisma.product.findUnique({ where: { id } });

    // 4. Update with Security Guard
    const product = await prisma.product.update({
      where: { 
        id,
        storeId: DEFAULT_STORE_ID 
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

export const getProducts = async (page: number = 1, limit: number = 20, filters?: { search?: string | undefined; category?: string | undefined; status?: string | undefined }) => {
  const skip = (page - 1) * limit;
  
  const where: any = { storeId: DEFAULT_STORE_ID };
  
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
