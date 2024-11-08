import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.userRoleEnum.createMany({
    data: [
      { id: 'cln7hdhb30000jd0deu344444', role: 'admin', permissions: ['read', 'write', 'delete'] },
      { id: 'cln7hdhb30000jd0deu344j9j', role: 'user', permissions: ['read'] },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });