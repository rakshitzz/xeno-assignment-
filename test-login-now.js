const http = require('http');

console.log('🔍 TESTING LOGIN RIGHT NOW');
console.log('==========================\n');

// Test if backend is running
console.log('1️⃣ Testing Backend...');
const req = http.get('http://localhost:4000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('   ✅ Backend is running!');
      console.log('   📊 Response:', data.trim());
      
      // Test login
      console.log('\n2️⃣ Testing Login...');
      testLogin();
    } else {
      console.log('   ❌ Backend error:', res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.log('   ❌ Backend is NOT running');
  console.log('   💡 The working server needs to be started');
  console.log('   Run: cd xeno-backend && node working-login.js');
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
      console.log('   📊 Response:', data);
      
      if (res.statusCode === 200) {
        console.log('   ✅ LOGIN WORKS!');
        console.log('   🎉 You can now login at http://localhost:3000');
        console.log('   🔑 Use: admin@xeno.com / admin123');
      } else {
        console.log('   ❌ LOGIN FAILED!');
        console.log('   💡 Backend might not be running properly');
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
  console.log('If login works:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Login with: admin@xeno.com / admin123');
  console.log('3. You should see the dashboard!');
}, 2000);
