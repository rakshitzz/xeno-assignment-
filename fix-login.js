require('./lib/database.js'); // Load environment variables
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixLogin() {
  try {
    console.log('🔧 FIXING LOGIN ISSUE');
    console.log('=====================\n');
    
    // Check if admin user exists
    console.log('1️⃣ Checking if admin user exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@xeno.com' }
    });
    
    if (existingUser) {
      console.log('   ✅ Admin user already exists');
      console.log('   📧 Email:', existingUser.email);
      console.log('   👤 Name:', existingUser.name);
      console.log('   🔑 Role:', existingUser.role);
    } else {
      console.log('   ❌ Admin user does not exist');
      console.log('   🔨 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@xeno.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'admin'
        }
      });
      
      console.log('   ✅ Admin user created successfully');
      console.log('   📧 Email:', newUser.email);
      console.log('   👤 Name:', newUser.name);
      console.log('   🔑 Role:', newUser.role);
    }
    
    // Test login
    console.log('\n2️⃣ Testing login...');
    const testUser = await prisma.user.findUnique({
      where: { email: 'admin@xeno.com' }
    });
    
    if (testUser) {
      const passwordMatch = await bcrypt.compare('admin123', testUser.password);
      if (passwordMatch) {
        console.log('   ✅ Password verification successful');
        console.log('   🎉 Login should work now!');
      } else {
        console.log('   ❌ Password verification failed');
      }
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('==============');
    console.log('1. Make sure backend is running: npm start');
    console.log('2. Open http://localhost:3000 in browser');
    console.log('3. Login with: admin@xeno.com / admin123');
    
  } catch (error) {
    console.error('❌ Error fixing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixLogin();