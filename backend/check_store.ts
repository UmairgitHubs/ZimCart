import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const store = await prisma.store.findFirst();
  console.log('ACTIVE_STORE_ID:', store?.id);
  const cats = await prisma.category.findMany({ 
    where: { name: 'Electronics' } 
  });
  console.log('Electronics Categories:', JSON.stringify(cats, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
