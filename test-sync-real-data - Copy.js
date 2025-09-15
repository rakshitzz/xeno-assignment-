const http = require('http');

async function testSyncRealData() {
  console.log('🔄 Testing Real Data Sync...');
  console.log('============================');
  
  // Test 1: Check backend
  console.log('1️⃣ Checking backend...');
  const backendOk = await checkBackend();
  if (!backendOk) {
    console.log('❌ Backend not running!');
    console.log('Start backend: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-backend" && node real-shopify-backend.js');
    return;
  }
  
  // Test 2: Login
  console.log('2️⃣ Testing login...');
  const loginResult = await testLogin();
  if (!loginResult.success) {
    console.log('❌ Login failed:', loginResult.error);
    return;
  }
  console.log('✅ Login successful!');
  
  // Test 3: Test sync with Books Store
  console.log('3️⃣ Testing sync with Books Store...');
  const syncResult = await testSync(loginResult.token, 'books-store', 'customers');
  if (syncResult.success) {
    console.log('✅ Sync successful!');
    console.log(`📊 Synced ${syncResult.count} customers`);
    console.log('🎉 Sync button is working with REAL data!');
  } else {
    console.log('❌ Sync failed:', syncResult.error);
  }
}

function checkBackend() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: '/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

async function testLogin() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      email: 'admin@xeno.com',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve({ success: true, token: result.token });
          } else {
            resolve({ success: false, error: result.error });
          }
        } catch (e) {
          resolve({ success: false, error: 'Invalid response' });
        }
      });
    });

    req.on('error', () => resolve({ success: false, error: 'Connection failed' }));
    req.write(postData);
    req.end();
  });
}

async function testSync(token, storeId, entity) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      tenantId: storeId
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: `/api/sync/${entity}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve({ success: true, count: result.count, data: result.data });
          } else {
            resolve({ success: false, error: result.error });
          }
        } catch (e) {
          resolve({ success: false, error: 'Invalid response' });
        }
      });
    });

    req.on('error', () => resolve({ success: false, error: 'Connection failed' }));
    req.write(postData);
    req.end();
  });
}

testSyncRealData();
