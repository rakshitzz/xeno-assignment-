const http = require('http');

console.log('🔍 TESTING WORKING LOGIN SERVER');
console.log('================================\n');

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
  console.log('   ❌ Backend is NOT running');
  console.log('   💡 Error:', err.message);
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
        console.log('   ✅ LOGIN WORKS!');
        try {
          const response = JSON.parse(data);
          if (response.token) {
            console.log('   🎫 Token received');
            console.log('   👤 User:', response.user.name);
          }
        } catch (e) {
          console.log('   ⚠️  Could not parse response');
        }
      } else {
        console.log('   ❌ LOGIN FAILED!');
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
  console.log('\n🎯 FINAL STATUS');
  console.log('===============');
  console.log('If login works:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Login with: admin@xeno.com / admin123');
  console.log('3. You should see the dashboard!');
}, 3000);
