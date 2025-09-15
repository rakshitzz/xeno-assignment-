const http = require('http');

console.log('🔍 CHECKING RUNNING SERVICES');
console.log('============================\n');

// Test Backend
console.log('1️⃣ Testing Backend (http://localhost:4000)...');
testService('http://localhost:4000/health', 'Backend');

// Test Frontend  
console.log('\n2️⃣ Testing Frontend (http://localhost:3000)...');
testService('http://localhost:3000', 'Frontend');

function testService(url, serviceName) {
  const req = http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`   ✅ ${serviceName} is running!`);
        if (serviceName === 'Backend') {
          console.log(`   📊 Response: ${data}`);
        }
      } else {
        console.log(`   ❌ ${serviceName} returned status: ${res.statusCode}`);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log(`   ❌ ${serviceName} is not running`);
    console.log(`   💡 Start ${serviceName.toLowerCase()} manually`);
  });
  
  req.setTimeout(3000, () => {
    console.log(`   ⏰ ${serviceName} request timed out`);
    req.destroy();
  });
}

setTimeout(() => {
  console.log('\n🎉 SERVICE STATUS CHECK COMPLETE');
  console.log('=================================');
  console.log('If both services are running:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Login with admin@xeno.com / admin123');
  console.log('3. Look for "Select Store" dropdown');
}, 2000);
