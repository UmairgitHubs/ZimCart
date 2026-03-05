import prisma from './config/db.js';

async function main() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  console.log('Categories with counts:');
  categories.forEach(c => {
    console.log(`${c.name} (ID: ${c.id}, Parent: ${c.parentCategoryId}, Store: ${c.storeId}): ${c._count.products} products`);
  });

  const products = await prisma.product.findMany({ take: 5 });
  console.log('\nLast 5 Products:');
  products.forEach(p => {
    console.log(`${p.name} (Store: ${p.storeId}, Category: ${p.categoryId}, SubCat: ${p.subCategory})`);
  });
  
  const stores = await prisma.store.findMany();
  console.log('\nStores in DB:');
  stores.forEach(s => console.log(`${s.name} (ID: ${s.id})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
