const http = require('http');

console.log('🔍 QUICK LOGIN TEST');
console.log('==================\n');

// Test Backend Health
console.log('1️⃣ Testing Backend Health...');
const healthReq = http.get('http://localhost:4000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('   ✅ Backend is running!');
      console.log('   📊 Health response:', data.trim());
      
      // Test Login
      console.log('\n2️⃣ Testing Login...');
      testLogin();
    } else {
      console.log('   ❌ Backend returned status:', res.statusCode);
    }
  });
});

healthReq.on('error', (err) => {
  console.log('   ❌ Backend is NOT running!');
  console.log('   💡 Start backend with: cd xeno-backend && npm start');
});

function testLogin() {
  const loginData = JSON.stringify({
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
      'Content-Length': loginData.length
    }
  };
  
  const loginReq = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('   📊 Login Status:', res.statusCode);
      console.log('   📊 Login Response:', data);
      
      if (res.statusCode === 200) {
        console.log('   ✅ Login successful!');
        try {
          const response = JSON.parse(data);
          if (response.token) {
            console.log('   🎫 Token received:', response.token.substring(0, 20) + '...');
          }
        } catch (e) {
          console.log('   ⚠️  Could not parse login response');
        }
      } else {
        console.log('   ❌ Login failed!');
        console.log('   💡 Check if admin user exists in database');
      }
    });
  });
  
  loginReq.on('error', (err) => {
    console.log('   ❌ Login request failed:', err.message);
  });
  
  loginReq.write(loginData);
  loginReq.end();
}

setTimeout(() => {
  console.log('\n🎯 SUMMARY');
  console.log('==========');
  console.log('If backend is running but login fails:');
  console.log('1. Check if admin user exists in database');
  console.log('2. Run: cd xeno-backend && node create-test-user.js');
  console.log('3. Try login again');
}, 3000);
