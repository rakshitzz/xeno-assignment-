// Load database configuration first
require('./lib/database.js');

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    await prisma.$connect();
    console.log('🔧 Creating test user...');

    const hashedPassword = await bcrypt.hash('test123', 10);
    
    await prisma.$executeRaw`
      INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
      VALUES (${'test-user'}, ${'test@xeno.com'}, ${hashedPassword}, ${'Test User'}, ${'admin'}, NOW(), NOW())
      ON CONFLICT ("email") DO UPDATE SET
        "password" = EXCLUDED."password",
        "name" = EXCLUDED."name",
        "role" = EXCLUDED."role",
        "updatedAt" = NOW();
    `;
    
    console.log('✅ Test user created!');
    console.log('   Email: test@xeno.com');
    console.log('   Password: test123');
    console.log('\nTry logging in with these credentials.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
