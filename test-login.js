// Load database configuration first
require('./lib/database.js');

const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();

async function testLogin() {
  console.log('🔐 TESTING LOGIN AUTHENTICATION');
  console.log('================================\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing Backend Server...');
    const backendRunning = await testBackendHealth();
    
    if (!backendRunning) {
      console.log('   ❌ Backend is not running');
      console.log('   💡 Start backend with: cd xeno-backend && npm start');
      return;
    }
    
    console.log('   ✅ Backend is running\n');

    // Test 2: Check database connection
    console.log('2️⃣ Testing Database Connection...');
    await prisma.$connect();
    console.log('   ✅ Database connected\n');

    // Test 3: Check if admin user exists
    console.log('3️⃣ Checking Admin User...');
    const adminUser = await prisma.$queryRaw`SELECT * FROM "users" WHERE email = 'admin@xeno.com'`;
    
    if (adminUser.length === 0) {
      console.log('   ❌ Admin user not found');
      console.log('   💡 Creating admin user...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.$executeRaw`
        INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
        VALUES (${'admin-user'}, ${'admin@xeno.com'}, ${hashedPassword}, ${'Admin User'}, ${'admin'}, NOW(), NOW())
        ON CONFLICT ("email") DO UPDATE SET
          "password" = EXCLUDED."password",
          "name" = EXCLUDED."name",
          "role" = EXCLUDED."role",
          "updatedAt" = NOW();
      `;
      
      console.log('   ✅ Admin user created/updated\n');
    } else {
      console.log('   ✅ Admin user exists\n');
    }

    // Test 4: Test login API
    console.log('4️⃣ Testing Login API...');
    const loginResult = await testLoginAPI();
    
    if (loginResult.success) {
      console.log('   ✅ Login API working');
      console.log(`   🔑 Token: ${loginResult.token.substring(0, 20)}...`);
      
      // Test 5: Test tenants API
      console.log('\n5️⃣ Testing Tenants API...');
      const tenantsResult = await testTenantsAPI(loginResult.token);
      
      if (tenantsResult.success) {
        console.log(`   ✅ Found ${tenantsResult.tenants.length} tenants:`);
        tenantsResult.tenants.forEach(tenant => {
          console.log(`      - ${tenant.name} (${tenant.id})`);
        });
      } else {
        console.log('   ❌ Tenants API failed');
      }
      
    } else {
      console.log('   ❌ Login API failed');
      console.log(`   📝 Error: ${loginResult.error}`);
    }

    console.log('\n🎉 LOGIN TEST COMPLETE');
    console.log('======================');
    console.log('If all tests passed:');
    console.log('1. Backend should be running on http://localhost:4000');
    console.log('2. Frontend should be running on http://localhost:3000');
    console.log('3. Login with admin@xeno.com / admin123 should work');
    console.log('4. "Select Store" dropdown should appear after login');

  } catch (error) {
    console.error('❌ Login test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function testBackendHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:4000/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(res.statusCode === 200 && data.trim() === 'ok');
      });
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function testLoginAPI() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      email: 'admin@xeno.com',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 && result.token) {
            resolve({ success: true, token: result.token });
          } else {
            resolve({ success: false, error: data });
          }
        } catch (error) {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', () => resolve({ success: false, error: 'Request failed' }));
    req.write(postData);
    req.end();
  });
}

function testTenantsAPI(token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/tenants',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve({ success: true, tenants: result });
          } else {
            resolve({ success: false, error: data });
          }
        } catch (error) {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', () => resolve({ success: false, error: 'Request failed' }));
    req.end();
  });
}

testLogin();
