const http = require('http');

console.log('🔐 TESTING LOGIN FIX');
console.log('====================\n');

// Test backend health
console.log('1️⃣ Testing Backend...');
testBackend();

// Test frontend
console.log('\n2️⃣ Testing Frontend...');
testFrontend();

function testBackend() {
  const req = http.get('http://localhost:4000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200 && data.trim() === 'ok') {
        console.log('   ✅ Backend is running on port 4000');
        
        // Test login
        testLogin();
      } else {
        console.log('   ❌ Backend is not running properly');
        console.log(`   Status: ${res.statusCode}, Response: ${data}`);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('   ❌ Backend is not running');
    console.log('   💡 Start backend with: cd xeno-backend && npm start');
  });
  
  req.setTimeout(5000, () => {
    console.log('   ⏰ Backend request timed out');
    req.destroy();
  });
}

function testLogin() {
  console.log('\n3️⃣ Testing Login...');
  
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
          console.log('   ✅ Login successful!');
          console.log(`   🔑 Token: ${result.token.substring(0, 20)}...`);
          
          // Test tenants
          testTenants(result.token);
        } else {
          console.log('   ❌ Login failed');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response: ${data}`);
          console.log('\n💡 Try these credentials:');
          console.log('   Email: admin@xeno.com');
          console.log('   Password: admin123');
        }
      } catch (error) {
        console.log('   ❌ Login response error');
        console.log(`   Response: ${data}`);
      }
    });
  });

  req.on('error', () => {
    console.log('   ❌ Login request failed');
  });
  
  req.write(postData);
  req.end();
}

function testTenants(token) {
  console.log('\n4️⃣ Testing Tenants...');
  
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
          console.log('\n🎉 LOGIN TEST COMPLETE!');
          console.log('========================');
          console.log('✅ Backend: Running');
          console.log('✅ Login: Working');
          console.log('✅ Tenants: Available');
          console.log('\n💡 Now try logging in at http://localhost:3000');
          console.log('   Email: admin@xeno.com');
          console.log('   Password: admin123');
        } else {
          console.log('   ❌ Tenants request failed');
          console.log(`   Status: ${res.statusCode}, Response: ${data}`);
        }
      } catch (error) {
        console.log('   ❌ Tenants response error');
        console.log(`   Response: ${data}`);
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
    }
  });
  
  req.on('error', (err) => {
    console.log('   ❌ Frontend is not running');
    console.log('   💡 Start frontend with: cd xeno-dashboard && npm start');
  });
  
  req.setTimeout(5000, () => {
    console.log('   ⏰ Frontend request timed out');
    req.destroy();
  });
}
