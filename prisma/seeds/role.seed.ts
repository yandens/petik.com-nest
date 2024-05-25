import { PrismaClient } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import * as process from 'node:process';

const prisma = new PrismaClient();

async function main() {
  const { randomUUID } = new ShortUniqueId({ length: 5 });
  const admin = await prisma.role.create({
    data: {
      id: randomUUID(),
      name: 'ADMIN',
    },
  });

  const user = await prisma.role.create({
    data: {
      id: randomUUID(),
      name: 'USER',
    },
  });

  console.log(admin, user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
