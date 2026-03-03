import prisma from '../config/db.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

export const getInventory = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  warehouse?: string;
}) => {
  const { page = 1, limit = 20, category, status, search, warehouse } = params;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (category) {
    where.category = { name: category };
  }

  if (status) {
    if (status === 'Out of Stock') {
      where.inventory = 0;
    } else if (status === 'Low Stock') {
      where.inventory = { gt: 0, lte: 10 };
    } else if (status === 'In Stock') {
      where.inventory = { gt: 10, lte: 100 };
    } else if (status === 'Overstock') {
      where.inventory = { gt: 100 };
    }
  }

  // Note: Warehouse location is currently mocked at the API level (Main Hub - Harare).
  // Real multi-warehouse features would be linked here via relations.

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } },
    ];
  }

  const statsWhere = { ...where };
  delete statsWhere.inventory;

  const [products, total, allMatchingForStats] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: statsWhere,
      select: {
        inventory: true,
        price: true
      }
    })
  ]);

  let totalValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const item of allMatchingForStats) {
    totalValue += item.inventory * item.price;
    if (item.inventory === 0) outOfStockCount++;
    else if (item.inventory <= 10) lowStockCount++;
  }

  // Map product to InventoryItem structure
  const inventoryItems = products.map((p) => {
    // Logic for available stock and status can be more complex based on orders
    const reservedStock = 0; // In a real app, calculate from pending orders
    const availableStock = p.inventory - reservedStock;
    
    // Status logic
    let calculatedStatus = p.status;
    if (p.inventory === 0) calculatedStatus = 'Out of Stock';
    else if (p.inventory <= 10) calculatedStatus = 'Low Stock';
    else if (p.inventory > 100) calculatedStatus = 'Overstock';
    else calculatedStatus = 'In Stock';

    return {
      id: p.id,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      category: p.category.name,
      currentStock: p.inventory,
      reservedStock,
      availableStock,
      restockThreshold: 10,
      status: calculatedStatus,
      warehouseLocation: "Main Hub - Harare", // Mocked or fetched from another model
      lastRestocked: p.updatedAt.toISOString(),
      unitPrice: p.price,
      totalValue: p.inventory * p.price,
      image: p.images[0],
    };
  });

  return {
    items: inventoryItems,
    stats: {
      totalValue,
      lowStockCount,
      outOfStockCount,
      reservedStockCount: 0 
    },
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  };
};

export const updateStock = async (id: string, currentStock: number, reason?: string) => {
  const oldProduct = await prisma.product.findUnique({ where: { id } });
  if (!oldProduct) throw new ApiError(404, "Product not found");

  const product = await prisma.product.update({
    where: { id },
    data: { 
      inventory: currentStock,
      history: {
        create: {
          event: "Inventory Alignment",
          description: reason || `Manual stock adjustment confirmed.`,
          metadata: { old: oldProduct.inventory, new: currentStock }
        }
      }
    }
  });

  return product;
};

export const getInventoryHistory = async (id: string) => {
  return prisma.productHistory.findMany({
    where: { productId: id },
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteInventory = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError(404, "Product not found");

  await prisma.product.delete({ where: { id } });
  return true;
};
