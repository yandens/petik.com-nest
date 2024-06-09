import { PrismaClient, UserRole } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import * as process from 'node:process';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const { randomUUID } = new ShortUniqueId({ length: 5 });
  const adminPassword = await bcrypt.hash('admin', 10);
  const admin = await prisma.user.create({
    data: {
      id: randomUUID(),
      role: UserRole.ADMIN,
      email: 'admin@petik.com',
      password: adminPassword,
      is_verified: true,
      account_type: 'BASIC',
    },
  });

  const userPassword = await bcrypt.hash('user', 10);
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      role: UserRole.USER,
      email: 'user@petik.com',
      password: userPassword,
      is_verified: true,
      account_type: 'BASIC',
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
