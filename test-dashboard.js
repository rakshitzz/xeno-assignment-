const http = require('http');

// Test backend server
function testBackend() {
  console.log('🔍 Testing Backend Server...');
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`✅ Backend Response: ${data}`);
      console.log('✅ Backend is running successfully!');
      console.log('');
      testAuth();
    });
  });

  req.on('error', (e) => {
    console.log(`❌ Backend Error: ${e.message}`);
    console.log('❌ Backend server is not running');
    console.log('');
    console.log('🚀 To start the backend manually:');
    console.log('   cd xeno-backend');
    console.log('   npm run start');
  });

  req.end();
}

// Test authentication endpoint
function testAuth() {
  console.log('🔍 Testing Authentication...');
  
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
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ Authentication successful!');
        console.log(`✅ User: ${response.user.email}`);
        console.log(`✅ Token received: ${response.token.substring(0, 20)}...`);
      } else {
        console.log(`❌ Auth failed: ${res.statusCode} - ${data}`);
      }
      console.log('');
      showAccessInfo();
    });
  });

  req.on('error', (e) => {
    console.log(`❌ Auth Error: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

function showAccessInfo() {
  console.log('🎉 DASHBOARD ACCESS INFORMATION:');
  console.log('================================');
  console.log('');
  console.log('🌐 Frontend Dashboard: http://localhost:3000');
  console.log('🔧 Backend API: http://localhost:4000');
  console.log('');
  console.log('🔐 Login Credentials:');
  console.log('   Email: admin@xeno.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('📊 Features Available:');
  console.log('   ✓ KPI Cards (customers, products, orders, revenue)');
  console.log('   ✓ Interactive Charts (orders by date, top customers)');
  console.log('   ✓ Date Range Filtering');
  console.log('   ✓ Data Tables (customers, products, orders)');
  console.log('   ✓ Manual Sync Controls');
  console.log('');
  console.log('🚀 If frontend is not running, start it with:');
  console.log('   cd xeno-dashboard');
  console.log('   npm start');
}

// Start the test
testBackend();
