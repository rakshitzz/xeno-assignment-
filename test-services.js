const http = require('http');

async function testServices() {
  console.log('🧪 Testing Services...\n');

  // Test Backend
  console.log('1️⃣ Testing Backend (http://localhost:4000)...');
  const backendRunning = await testEndpoint('http://localhost:4000/health');
  if (backendRunning) {
    console.log('   ✅ Backend is running\n');
    
    // Test authentication
    console.log('2️⃣ Testing Authentication...');
    const authResult = await testAuth();
    if (authResult.success) {
      console.log('   ✅ Authentication working');
      console.log(`   🔑 Token: ${authResult.token.substring(0, 20)}...\n`);
      
      // Test tenants endpoint
      console.log('3️⃣ Testing Tenants Endpoint...');
      const tenantsResult = await testTenants(authResult.token);
      if (tenantsResult.success) {
        console.log(`   ✅ Found ${tenantsResult.tenants.length} tenants:`);
        tenantsResult.tenants.forEach(tenant => {
          console.log(`      - ${tenant.name} (${tenant.id})`);
        });
        console.log('\n🎉 All services are working!');
        console.log('💡 Open http://localhost:3000 in your browser');
      } else {
        console.log('   ❌ Tenants endpoint failed');
      }
    } else {
      console.log('   ❌ Authentication failed');
    }
  } else {
    console.log('   ❌ Backend is not running');
    console.log('   💡 Start backend with: cd xeno-backend && npm start');
  }

  // Test Frontend
  console.log('\n4️⃣ Testing Frontend (http://localhost:3000)...');
  const frontendRunning = await testEndpoint('http://localhost:3000');
  if (frontendRunning) {
    console.log('   ✅ Frontend is running');
  } else {
    console.log('   ❌ Frontend is not running');
    console.log('   💡 Start frontend with: cd xeno-dashboard && npm start');
  }
}

function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function testAuth() {
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

function testTenants(token) {
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

testServices();
