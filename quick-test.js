const http = require('http');

console.log('🔍 QUICK TEST - CHECKING SERVICES');
console.log('==================================\n');

// Test Backend
console.log('Testing Backend (port 4000)...');
const backendReq = http.get('http://localhost:4000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Backend is running!');
      console.log('Response:', data.trim());
    } else {
      console.log('❌ Backend error:', res.statusCode);
    }
  });
});

backendReq.on('error', (err) => {
  console.log('❌ Backend is NOT running');
  console.log('Error:', err.message);
});

// Test Frontend
setTimeout(() => {
  console.log('\nTesting Frontend (port 3000)...');
  const frontendReq = http.get('http://localhost:3000', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Frontend is running!');
      console.log('🌐 Open http://localhost:3000 in your browser');
      console.log('🔑 Login with: admin@xeno.com / admin123');
    } else {
      console.log('❌ Frontend error:', res.statusCode);
    }
  });

  frontendReq.on('error', (err) => {
    console.log('❌ Frontend is NOT running');
    console.log('Error:', err.message);
  });
}, 2000);

setTimeout(() => {
  console.log('\n🎯 SUMMARY');
  console.log('==========');
  console.log('If both services are running:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Login with admin@xeno.com / admin123');
  console.log('3. Look for "Select Store" dropdown');
}, 5000);