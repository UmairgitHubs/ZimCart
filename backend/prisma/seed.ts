import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';

const DEMO_PASSWORD = 'Demo1234!';

const PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop';

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@demo.zimcart.com' },
    update: { name: 'Demo Customer', password: passwordHash, role: 'CUSTOMER', status: 'ACTIVE' },
    create: {
      email: 'customer@demo.zimcart.com',
      password: passwordHash,
      name: 'Demo Customer',
      phone: '+923001234567',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      termsConsent: true,
      privacyConsent: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.zimcart.com' },
    update: { name: 'Demo Admin', password: passwordHash, role: 'ADMIN', status: 'ACTIVE' },
    create: {
      email: 'admin@demo.zimcart.com',
      password: passwordHash,
      name: 'Demo Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      termsConsent: true,
      privacyConsent: true,
    },
  });

  const demoMarts = [
    {
      name: 'ZimCart Fresh Mart',
      description: 'Demo grocery mart with everyday essentials for app testing.',
      image:
        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop',
      rating: 4.7,
      deliveryTime: '25-35 min',
      minOrder: 500,
      deliveryFee: 99,
    },
    {
      name: 'TechWorld Express',
      description: 'Phones, laptops, and gadgets with fast delivery.',
      image:
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
      rating: 4.6,
      deliveryTime: '35-50 min',
      minOrder: 2000,
      deliveryFee: 149,
    },
    {
      name: 'Style Avenue',
      description: 'Fashion, footwear, and accessories for every occasion.',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
      rating: 4.5,
      deliveryTime: '30-45 min',
      minOrder: 1500,
      deliveryFee: 120,
    },
  ] as const;

  let store = await prisma.store.findFirst({ where: { name: demoMarts[0].name } });

  for (const mart of demoMarts) {
    const existing = await prisma.store.findFirst({ where: { name: mart.name } });
    if (existing) {
      await prisma.store.update({
        where: { id: existing.id },
        data: {
          description: mart.description,
          image: mart.image,
          rating: mart.rating,
          deliveryTime: mart.deliveryTime,
          minOrder: mart.minOrder,
          deliveryFee: mart.deliveryFee,
          isActive: true,
          status: 'OPEN',
        },
      });
      if (mart.name === demoMarts[0].name) store = existing;
      continue;
    }
    const created = await prisma.store.create({
      data: {
        name: mart.name,
        description: mart.description,
        image: mart.image,
        rating: mart.rating,
        deliveryTime: mart.deliveryTime,
        minOrder: mart.minOrder,
        deliveryFee: mart.deliveryFee,
        isActive: true,
        status: 'OPEN',
        openingHours: {
          monday: { open: '08:00', close: '22:00', closed: false },
          _preferences: { currency: 'PKR', timezone: 'Asia/Karachi' },
        },
      },
    });
    if (mart.name === demoMarts[0].name) store = created;
  }

  if (!store) {
    throw new Error('Failed to seed primary demo mart');
  }

  const categories = [
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Dairy', slug: 'dairy' },
    { name: 'Snacks', slug: 'snacks' },
    { name: 'Beverages', slug: 'beverages' },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, status: 'Published', storeId: store.id },
      create: {
        name: cat.name,
        slug: cat.slug,
        status: 'Published',
        storeId: store.id,
        image: PRODUCT_IMAGE,
      },
    });
    categoryIds[cat.slug] = row.id;
  }

  const products = [
    {
      sku: 'DEMO-RICE-5KG',
      name: 'Basmati Rice 5kg',
      price: 1899,
      discountPrice: 1699,
      isDeal: true,
      discountPercentage: 10,
      inventory: 120,
      categoryId: categoryIds.grocery,
    },
    {
      sku: 'DEMO-MILK-1L',
      name: 'Fresh Milk 1L',
      price: 320,
      discountPrice: 0,
      isDeal: false,
      discountPercentage: 0,
      inventory: 80,
      categoryId: categoryIds.dairy,
    },
    {
      sku: 'DEMO-EGGS-12',
      name: 'Farm Eggs (12 pack)',
      price: 450,
      discountPrice: 399,
      isDeal: true,
      discountPercentage: 11,
      inventory: 60,
      categoryId: categoryIds.dairy,
    },
    {
      sku: 'DEMO-CHIPS',
      name: 'Potato Chips Family Pack',
      price: 280,
      discountPrice: 0,
      isDeal: false,
      discountPercentage: 0,
      inventory: 200,
      categoryId: categoryIds.snacks,
    },
    {
      sku: 'DEMO-JUICE-1L',
      name: 'Orange Juice 1L',
      price: 350,
      discountPrice: 299,
      isDeal: true,
      discountPercentage: 15,
      inventory: 90,
      categoryId: categoryIds.beverages,
    },
    {
      sku: 'DEMO-BREAD',
      name: 'Whole Wheat Bread',
      price: 180,
      discountPrice: 0,
      isDeal: false,
      discountPercentage: 0,
      inventory: 45,
      categoryId: categoryIds.grocery,
    },
    {
      sku: 'DEMO-CHICKEN-1KG',
      name: 'Chicken Breast 1kg',
      price: 890,
      discountPrice: 799,
      isDeal: true,
      discountPercentage: 10,
      inventory: 35,
      categoryId: categoryIds.grocery,
    },
    {
      sku: 'DEMO-WATER-6',
      name: 'Mineral Water 6-Pack',
      price: 420,
      discountPrice: 0,
      isDeal: false,
      discountPercentage: 0,
      inventory: 150,
      categoryId: categoryIds.beverages,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice || null,
        isDeal: p.isDeal,
        discountPercentage: p.discountPercentage,
        inventory: p.inventory,
        status: 'Published',
        storeId: store.id,
        categoryId: p.categoryId,
        images: [PRODUCT_IMAGE],
      },
      create: {
        name: p.name,
        sku: p.sku,
        price: p.price,
        discountPrice: p.discountPrice || null,
        isDeal: p.isDeal,
        discountPercentage: p.discountPercentage,
        inventory: p.inventory,
        status: 'Published',
        storeId: store.id,
        categoryId: p.categoryId,
        images: [PRODUCT_IMAGE],
        costPrice: p.price * 0.7,
      },
    });
  }

  const existingAddress = await prisma.address.findFirst({
    where: { userId: customer.id, isDefault: true },
  });
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        label: 'Home',
        address: '107 Street 65, F-10',
        detail: 'Islamabad',
        isDefault: true,
      },
    });
  }

  console.log('Seed complete.');
  console.log(`  Store: ${store.name} (${store.id})`);
  console.log(`  Products: ${products.length}`);
  console.log('  Demo logins (password: Demo1234!):');
  console.log('    customer@demo.zimcart.com');
  console.log('    admin@demo.zimcart.com');
  console.log(`  Admin user id: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
