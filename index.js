// Load database configuration
require('./lib/database');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Connected to Neon database with dual URL configuration');
  console.log('📊 Database URL (pooler):', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
  console.log('🔗 Direct URL:', process.env.DIRECT_URL.replace(/:[^:@]*@/, ':****@'));
  
  // Test the connection
  try {
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('📋 PostgreSQL version:', result[0].version.split(' ')[0] + ' ' + result[0].version.split(' ')[1]);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
