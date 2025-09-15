const http = require('http');

function checkService(port, name) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: port === 4000 ? '/health' : '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      console.log(`✅ ${name} is running on port ${port}`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log(`❌ ${name} is NOT running on port ${port}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name} timeout on port ${port}`);
      resolve(false);
    });

    req.end();
  });
}

async function checkAllServices() {
  console.log('🔍 Checking Services...');
  console.log('======================');
  
  const backend = await checkService(4000, 'Backend');
  const frontend = await checkService(3000, 'Frontend');
  
  console.log('');
  if (backend && frontend) {
    console.log('🎉 Both services are running!');
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('🔑 Login: admin@xeno.com / admin123');
  } else {
    console.log('⚠️  Some services are not running.');
    console.log('');
    console.log('To start services:');
    console.log('1. Backend: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-backend" && node real-shopify-backend.js');
    console.log('2. Frontend: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-dashboard" && npm start');
  }
}

checkAllServices();