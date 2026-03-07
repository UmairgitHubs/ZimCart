import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany({
    include: {
      _count: {
        select: {
          products: true,
          categories: true
        }
      },
      products: {
        select: {
          id: true,
          name: true,
          status: true
        }
      },
      categories: {
        select: {
          id: true,
          name: true,
          status: true
        }
      }
    }
  });

  console.log('--- DATABASE STATUS REPORT ---');
  stores.forEach(store => {
    console.log(`Store: ${store.name} (${store.id})`);
    console.log(`  Categories Count: ${store._count.categories}`);
    console.log(`  Products Count: ${store._count.products}`);
    
    console.log('  Products:');
    store.products.forEach(p => {
        console.log(`    - ${p.name} [Status: ${p.status}]`);
    });

    console.log('  Categories:');
    store.categories.forEach(c => {
        console.log(`    - ${c.name} [Status: ${c.status}]`);
    });
    console.log('----------------------------');
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
