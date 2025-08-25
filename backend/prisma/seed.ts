import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@neuraweb.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample data
  const sampleContact = await prisma.contact.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'I am interested in your web development services. Could you please provide more information?',
      status: 'pending',
    },
  });

  const sampleQuote = await prisma.quote.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@business.com',
      serviceType: 'showcase',
      options: ['design', 'maintenance'],
      message: 'Looking for a professional website for my restaurant business.',
      estimatedPrice: 4800,
      status: 'pending',
    },
  });

  const sampleBooking = await prisma.booking.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 123-4567',
      message: 'Want to discuss AI integration for our platform.',
      selectedSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: 'confirmed',
    },
  });

  console.log('✅ Sample data created');
  console.log('🌱 Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });