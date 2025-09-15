const http = require('http');

console.log('🔍 DIAGNOSING MULTI-TENANT SYSTEM');
console.log('==================================\n');

// Test Backend
console.log('1️⃣ Testing Backend Server...');
testBackend();

// Test Frontend
console.log('\n2️⃣ Testing Frontend Server...');
testFrontend();

function testBackend() {
  const req = http.get('http://localhost:4000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('   ✅ Backend is running on port 4000');
        console.log(`   📊 Response: ${data}`);
        
        // Test authentication
        testAuth();
      } else {
        console.log(`   ❌ Backend returned status: ${res.statusCode}`);
        console.log('   💡 Start backend with: cd xeno-backend && npm start');
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('   ❌ Backend is not running');
    console.log('   💡 Start backend with: cd xeno-backend && npm start');
  });
  
  req.setTimeout(5000, () => {
    console.log('   ⏰ Backend request timed out');
    console.log('   💡 Start backend with: cd xeno-backend && npm start');
    req.destroy();
  });
}

function testAuth() {
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
          console.log('   ✅ Authentication working');
          console.log(`   🔑 Token: ${result.token.substring(0, 20)}...`);
          
          // Test tenants
          testTenants(result.token);
        } else {
          console.log('   ❌ Authentication failed');
          console.log(`   📝 Response: ${data}`);
        }
      } catch (error) {
        console.log('   ❌ Authentication response error');
        console.log(`   📝 Response: ${data}`);
      }
    });
  });

  req.on('error', () => {
    console.log('   ❌ Authentication request failed');
  });
  
  req.write(postData);
  req.end();
}

function testTenants(token) {
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
          console.log(`   ✅ Found ${result.length} tenants:`);
          result.forEach(tenant => {
            console.log(`      - ${tenant.name} (${tenant.id})`);
          });
          console.log('\n🎉 Backend is fully functional!');
        } else {
          console.log('   ❌ Tenants endpoint failed');
          console.log(`   📝 Response: ${data}`);
        }
      } catch (error) {
        console.log('   ❌ Tenants response error');
        console.log(`   📝 Response: ${data}`);
      }
    });
  });

  req.on('error', () => {
    console.log('   ❌ Tenants request failed');
  });
  
  req.end();
}

function testFrontend() {
  const req = http.get('http://localhost:3000', (res) => {
    if (res.statusCode === 200) {
      console.log('   ✅ Frontend is running on port 3000');
      console.log('   🌐 Open http://localhost:3000 in your browser');
    } else {
      console.log(`   ❌ Frontend returned status: ${res.statusCode}`);
      console.log('   💡 Start frontend with: cd xeno-dashboard && npm start');
    }
  });
  
  req.on('error', (err) => {
    console.log('   ❌ Frontend is not running');
    console.log('   💡 Start frontend with: cd xeno-dashboard && npm start');
  });
  
  req.setTimeout(5000, () => {
    console.log('   ⏰ Frontend request timed out');
    console.log('   💡 Start frontend with: cd xeno-dashboard && npm start');
    req.destroy();
  });
}
