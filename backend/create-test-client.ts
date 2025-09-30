import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'Test123456';
  const passwordHash = await bcrypt.hash(password, 10);

  const client = await prisma.client.create({
    data: {
      name: 'Test Client',
      email: email,
      passwordHash: passwordHash,
      isValidated: true,
    },
  });

  console.log('✅ Client créé:', client);
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());