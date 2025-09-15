const http = require('http');

function testService(port, name) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: port === 4000 ? '/health' : '/',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      console.log(`✅ ${name} is running on port ${port}`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log(`❌ ${name} is NOT running on port ${port}`);
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name} timeout on port ${port}`);
      resolve(false);
    });

    req.end();
  });
}

async function testAllServices() {
  console.log('🔍 Testing Services...');
  console.log('====================');
  
  const backend = await testService(4000, 'Backend');
  const frontend = await testService(3000, 'Frontend');
  
  console.log('');
  if (backend && frontend) {
    console.log('🎉 Both services are running!');
    console.log('');
    console.log('🌐 Access your dashboard:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend: http://localhost:4000/health');
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Email: admin@xeno.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('📊 Then:');
    console.log('   1. Select a store (Books or Electronics)');
    console.log('   2. Click Sync button');
    console.log('   3. See real data from your Shopify stores!');
  } else {
    console.log('⚠️  Some services are not running.');
    console.log('');
    console.log('To start services manually:');
    console.log('');
    console.log('Backend:');
    console.log('  cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-backend"');
    console.log('  node real-shopify-backend.js');
    console.log('');
    console.log('Frontend:');
    console.log('  cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-dashboard"');
    console.log('  npm start');
  }
}

testAllServices();