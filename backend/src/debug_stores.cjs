import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const stores = await prisma.store.findMany();
  console.log('Stores:', JSON.stringify(stores, null, 2));
  const productsCount = await prisma.product.count();
  console.log('Total Products in DB:', productsCount);
  const firstProduct = await prisma.product.findFirst();
  console.log('First Product StoreId:', firstProduct?.storeId);
}
main();
