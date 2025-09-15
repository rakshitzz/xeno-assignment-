const http = require('http');

async function testSyncFunctionality() {
  console.log('🧪 Testing Sync Functionality...');
  console.log('================================');
  
  // Test 1: Check if backend is running
  console.log('1️⃣ Checking backend...');
  const backendRunning = await checkService(4000, 'Backend');
  
  if (!backendRunning) {
    console.log('❌ Backend is not running!');
    console.log('To start backend: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-backend" && node real-shopify-backend.js');
    return;
  }
  
  // Test 2: Check if frontend is running
  console.log('2️⃣ Checking frontend...');
  const frontendRunning = await checkService(3000, 'Frontend');
  
  if (!frontendRunning) {
    console.log('❌ Frontend is not running!');
    console.log('To start frontend: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-dashboard" && npm start');
    return;
  }
  
  // Test 3: Test login
  console.log('3️⃣ Testing login...');
  try {
    const loginData = await testLogin();
    if (loginData.success) {
      console.log('✅ Login successful!');
      
      // Test 4: Test sync with Books Store
      console.log('4️⃣ Testing sync with Books Store...');
      const syncResult = await testSync(loginData.token, 'books-store', 'customers');
      if (syncResult.success) {
        console.log('✅ Sync successful!');
        console.log(`📊 Synced ${syncResult.count} customers from Books Store`);
        console.log('🎉 Sync button is working!');
      } else {
        console.log('❌ Sync failed:', syncResult.error);
      }
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

function checkService(port, name) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: port === 4000 ? '/health' : '/',
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

testSyncFunctionality();
