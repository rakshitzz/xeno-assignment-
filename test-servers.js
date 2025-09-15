const http = require('http');

console.log('🔍 Testing Both Servers...\n');

// Test Backend
console.log('1. Testing Backend (port 4000)...');
const backendReq = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/health',
  method: 'GET'
}, (res) => {
  console.log(`   ✅ Backend Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(`   ✅ Backend Response: ${data}`);
    
    // Test Frontend
    console.log('\n2. Testing Frontend (port 3000)...');
    const frontendReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    }, (res) => {
      console.log(`   ✅ Frontend Status: ${res.statusCode}`);
      console.log('\n🎯 Both servers are running!');
      console.log('📊 Dashboard: http://localhost:3000');
      console.log('🔧 Backend API: http://localhost:4000');
      console.log('\nLogin with: admin@xeno.com / admin123');
    });
    
    frontendReq.on('error', (err) => {
      console.log(`   ⏳ Frontend still starting... (${err.message})`);
      console.log('   💡 Wait 30-60 seconds for React to compile');
    });
    
    frontendReq.end();
  });
});

backendReq.on('error', (err) => {
  console.log(`   ❌ Backend Error: ${err.message}`);
  console.log('   💡 Backend not running - start it with: npm start');
});

backendReq.end();
