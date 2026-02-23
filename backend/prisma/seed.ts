import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ZimCart database...');

  // 1. Create a Mart Store
  const store = await prisma.store.upsert({
    where: { id: 'f8d7b3a9-1c9d-4e2b-8a1d-9c3f4e5d6a7b' },
    update: {},
    create: {
      id: 'f8d7b3a9-1c9d-4e2b-8a1d-9c3f4e5d6a7b',
      name: 'ZimCart Fresh Mart',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
      description: 'Your one-stop shop for fresh groceries and daily essentials.',
      rating: 4.8,
      deliveryTime: '20-35 min',
      minOrder: 200,
      deliveryFee: 50,
    }
  });

  // 2. Create Categories
  const catDairy = await prisma.category.create({
    data: {
      name: 'Dairy & Eggs',
      storeId: store.id,
      image: 'https://images.unsplash.com/photo-1550583724-1255814278b5?q=80&w=200&auto=format&fit=crop',
    }
  });

  const catVeggies = await prisma.category.create({
    data: {
      name: 'Fresh Vegetables',
      storeId: store.id,
      image: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?q=80&w=200&auto=format&fit=crop',
    }
  });

  // 3. Create Products
  await prisma.product.createMany({
    data: [
      {
        id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
        name: 'Fresh Organic Milk',
        description: '1 Liter • Full Cream',
        price: 180,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1563636619-e91000f21fca?q=80&w=200&auto=format&fit=crop',
        categoryId: catDairy.id,
        storeId: store.id,
      },
      {
        id: 'd2e3f4a5-b6c7-4d8e-9a0b-1c2d3e4f5g6h',
        name: 'Red Roma Tomatoes',
        description: '1 kg • Farm Fresh',
        price: 120,
        stock: 100,
        image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=200&auto=format&fit=crop',
        categoryId: catVeggies.id,
        storeId: store.id,
      },
      {
        id: 'c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7r',
        name: 'Daily Fresh Eggs',
        description: 'Dozen • Grade A',
        price: 360,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1582722891823-202e7e034449?q=80&w=200&auto=format&fit=crop',
        categoryId: catDairy.id,
        storeId: store.id,
      }
    ]
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
