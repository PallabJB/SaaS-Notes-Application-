// // prisma/seed.js
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');

// const prisma = new PrismaClient();

// async function main() {
//   // Create tenants
//   const acme = await prisma.tenant.upsert({
//     where: { slug: 'acme' },
//     update: {},
//     create: {
//       slug: 'acme',
//       name: 'Acme Inc',
//       plan: 'FREE',
//     },
//   });

//   const globex = await prisma.tenant.upsert({
//     where: { slug: 'globex' },
//     update: {},
//     create: {
//       slug: 'globex',
//       name: 'Globex Corp',
//       plan: 'FREE',
//     },
//   });

//   // Hash password "password"
//   const hashedPassword = await bcrypt.hash('password', 10);

//   // Users for Acme
//   await prisma.user.upsert({
//     where: { email: 'admin@acme.test' },
//     update: {},
//     create: {
//       email: 'admin@acme.test',
//       password: hashedPassword,
//       role: 'ADMIN',
//       tenantId: acme.id,
//     },
//   });

//   await prisma.user.upsert({
//     where: { email: 'user@acme.test' },
//     update: {},
//     create: {
//       email: 'user@acme.test',
//       password: hashedPassword,
//       role: 'MEMBER',
//       tenantId: acme.id,
//     },
//   });

//   // Users for Globex
//   await prisma.user.upsert({
//     where: { email: 'admin@globex.test' },
//     update: {},
//     create: {
//       email: 'admin@globex.test',
//       password: hashedPassword,
//       role: 'ADMIN',
//       tenantId: globex.id,
//     },
//   });

//   await prisma.user.upsert({
//     where: { email: 'user@globex.test' },
//     update: {},
//     create: {
//       email: 'user@globex.test',
//       password: hashedPassword,
//       role: 'MEMBER',
//       tenantId: globex.id,
//     },
//   });
// }

// main()
//   .then(async () => {
//     console.log('✅ Database has been seeded.');
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


// prisma/seed.js
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Tenants
  const acmeTenant = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      slug: 'acme',
      name: 'Acme',
      plan: 'FREE',
    },
  });

  const globexTenant = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {},
    create: {
      slug: 'globex',
      name: 'Globex',
      plan: 'FREE',
    },
  });

  // Create Users
  const passwordHash = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {},
    create: {
      email: 'admin@acme.test',
      password: passwordHash,
      role: 'ADMIN',
      tenantId: acmeTenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@acme.test' },
    update: {},
    create: {
      email: 'user@acme.test',
      password: passwordHash,
      role: 'MEMBER',
      tenantId: acmeTenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@globex.test' },
    update: {},
    create: {
      email: 'admin@globex.test',
      password: passwordHash,
      role: 'ADMIN',
      tenantId: globexTenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@globex.test' },
    update: {},
    create: {
      email: 'user@globex.test',
      password: passwordHash,
      role: 'MEMBER',
      tenantId: globexTenant.id,
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
