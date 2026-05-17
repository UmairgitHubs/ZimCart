import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zimcart.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'ZimCart Admin';

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    if (existing.role === 'ADMIN') {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      return;
    }
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: 'ADMIN', status: 'ACTIVE' },
    });
    console.log(`Promoted existing user to ADMIN: ${ADMIN_EMAIL}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
      phone: '+263770000001',
      role: 'ADMIN',
      status: 'ACTIVE',
      termsConsent: true,
      privacyConsent: true,
      notifications: {
        create: {
          pushEnabled: true,
          emailEnabled: true,
          smsEnabled: false,
        },
      },
    },
  });

  console.log('Admin user created successfully.');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('  Login at: http://localhost:3000 (admin dashboard)');
}

main()
  .catch((err) => {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
