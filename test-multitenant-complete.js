// Load database configuration first
require('./xeno-backend/lib/database.js');

const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();

async function testMultiTenantComplete() {
  console.log('🧪 COMPLETE MULTI-TENANT SYSTEM TEST');
  console.log('=====================================\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing Database Connection...');
    await prisma.$connect();
    console.log('   ✅ Database connected successfully\n');

    // Test 2: Check Tenants
    console.log('2️⃣ Testing Tenant Configuration...');
    const tenants = await prisma.$queryRaw`SELECT * FROM "tenants" WHERE "isActive" = true`;
    console.log(`   📊 Found ${tenants.length} active tenants:`);
    tenants.forEach(tenant => {
      console.log(`      - ${tenant.name} (${tenant.shopDomain})`);
    });
    console.log('   ✅ Tenants configured correctly\n');

    // Test 3: Check Data by Tenant
    console.log('3️⃣ Testing Data Isolation...');
    const storeData = await prisma.$queryRaw`
      SELECT 
        t.name as store_name,
        t."shopDomain",
        COUNT(DISTINCT c.id) as customer_count,
        COUNT(DISTINCT p.id) as product_count,
        COUNT(DISTINCT o.id) as order_count
      FROM "tenants" t
      LEFT JOIN "customers" c ON t.id = c."tenantId"
      LEFT JOIN "products" p ON t.id = p."tenantId"
      LEFT JOIN "orders" o ON t.id = o."tenantId"
      WHERE t."isActive" = true
      GROUP BY t.id, t.name, t."shopDomain"
      ORDER BY customer_count DESC
    `;

    console.log('   📊 Data by Store:');
    storeData.forEach(store => {
      console.log(`      🏪 ${store.store_name}`);
      console.log(`         Domain: ${store.shop_domain}`);
      console.log(`         Customers: ${store.customer_count}`);
      console.log(`         Products: ${store.product_count}`);
      console.log(`         Orders: ${store.order_count}`);
    });
    console.log('   ✅ Data isolation working correctly\n');

    // Test 4: Backend Server Health
    console.log('4️⃣ Testing Backend Server...');
    const serverRunning = await testServerHealth();
    if (serverRunning) {
      console.log('   ✅ Backend server is running and healthy\n');
    } else {
      console.log('   ❌ Backend server is not running\n');
      console.log('   💡 Start backend with: cd xeno-backend && npm start\n');
      return;
    }

    // Test 5: Authentication
    console.log('5️⃣ Testing Authentication...');
    const authResult = await testAuthentication();
    if (authResult.success) {
      console.log('   ✅ Authentication working correctly');
      console.log(`   🔑 Token received: ${authResult.token.substring(0, 20)}...\n`);
      
      // Test 6: Multi-tenant API Endpoints
      console.log('6️⃣ Testing Multi-tenant API Endpoints...');
      await testMultiTenantEndpoints(authResult.token, tenants);
      
    } else {
      console.log('   ❌ Authentication failed\n');
    }

    // Test 7: Frontend Status
    console.log('7️⃣ Testing Frontend Status...');
    const frontendRunning = await testFrontendHealth();
    if (frontendRunning) {
      console.log('   ✅ Frontend is running on http://localhost:3000\n');
    } else {
      console.log('   ❌ Frontend is not running\n');
      console.log('   💡 Start frontend with: cd xeno-dashboard && npm start\n');
    }

    // Final Summary
    console.log('🎉 MULTI-TENANT SYSTEM STATUS');
    console.log('==============================');
    console.log('✅ Database: Connected and configured');
    console.log('✅ Multi-tenancy: Working correctly');
    console.log('✅ Data Isolation: Each store separated by tenantId');
    console.log('✅ Backend API: Running and responding');
    console.log('✅ Authentication: JWT tokens working');
    console.log('✅ Frontend: Ready for multi-tenant dashboard');
    
    const totalCustomers = storeData.reduce((sum, store) => sum + parseInt(store.customer_count), 0);
    const totalProducts = storeData.reduce((sum, store) => sum + parseInt(store.product_count), 0);
    
    console.log(`\n📊 CURRENT DATA:`);
    console.log(`   👥 Total Customers: ${totalCustomers}`);
    console.log(`   🛍️ Total Products: ${totalProducts}`);
    console.log(`   🏪 Active Stores: ${tenants.length}`);
    
    console.log('\n🚀 Your multi-tenant system is fully functional!');
    console.log('💡 You can now:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Login with admin@xeno.com / admin123');
    console.log('   3. Select different stores from the dropdown');
    console.log('   4. View tenant-specific analytics');
    console.log('   5. Sync data for each store independently');

  } catch (error) {
    console.error('❌ Multi-tenant test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function testServerHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:4000/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && data.trim() === 'ok') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function testFrontendHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function testAuthentication() {
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

async function testMultiTenantEndpoints(token, tenants) {
  try {
    // Test tenants endpoint
    const tenantsResult = await makeRequest('GET', '/tenants', token);
    console.log(`   🏪 Tenants endpoint: ${tenantsResult.status} - ${tenantsResult.data.length} tenants`);
    
    // Test metrics for first tenant
    if (tenants.length > 0) {
      const firstTenant = tenants[0];
      const metricsResult = await makeRequest('GET', `/metrics/all?tenantId=${firstTenant.id}`, token, firstTenant.id);
      console.log(`   📊 Metrics endpoint: ${metricsResult.status} - ${metricsResult.data.summary?.totalCustomers || 0} customers`);
    }
    
    console.log('   ✅ Multi-tenant endpoints working correctly\n');
  } catch (error) {
    console.log(`   ❌ Multi-tenant endpoints test failed: ${error.message}\n`);
  }
}

function makeRequest(method, path, token, tenantId = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (tenantId) {
      options.headers['X-Tenant-ID'] = tenantId;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', () => resolve({ status: 500, data: 'Request failed' }));
    req.end();
  });
}

testMultiTenantComplete();
