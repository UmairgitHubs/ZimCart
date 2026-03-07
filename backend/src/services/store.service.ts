import prisma from '../config/db.js';

export const getAllMarts = async () => {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
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

export const getMartById = async (id: string, search?: string, category?: string) => {
  const productWhere: any = { storeId: id };
  
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
    const store = await prisma.store.findUnique({
      where: { id },
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
    return prisma.store.findUnique({
      where: { id },
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
