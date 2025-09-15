const http = require('http');

function testStoresEndpoint() {
  console.log('🏪 Testing Stores Endpoint...');
  console.log('============================');
  
  const req = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/tenants',
    method: 'GET',
    timeout: 5000
  }, (res) => {
    console.log(`✅ Backend is running! Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const stores = JSON.parse(data);
        console.log(`📊 Found ${stores.length} stores:`);
        stores.forEach((store, index) => {
          console.log(`   ${index + 1}. ${store.name} (${store.id})`);
        });
        console.log('');
        console.log('🎉 Store dropdown should now work!');
        console.log('🌐 Refresh your dashboard at http://localhost:3000');
      } catch (e) {
        console.log('❌ Invalid response from backend');
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Backend is NOT running!');
    console.log('Error:', err.message);
    console.log('');
    console.log('To start backend:');
    console.log('cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-backend"');
    console.log('node real-shopify-backend.js');
  });

  req.on('timeout', () => {
    console.log('⏰ Backend timeout - not responding');
  });

  req.end();
}

testStoresEndpoint();
