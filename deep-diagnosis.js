const http = require('http');
const { exec } = require('child_process');

console.log('🔍 DEEP DIAGNOSIS - MULTI-TENANT DASHBOARD');
console.log('==========================================\n');

// Check if ports are in use
console.log('1️⃣ CHECKING PORTS...');
checkPort(4000, 'Backend');
checkPort(3000, 'Frontend');

// Check backend health
setTimeout(() => {
  console.log('\n2️⃣ CHECKING BACKEND HEALTH...');
  checkBackendHealth();
}, 1000);

// Check database connection
setTimeout(() => {
  console.log('\n3️⃣ CHECKING DATABASE CONNECTION...');
  checkDatabase();
}, 2000);

// Check admin user
setTimeout(() => {
  console.log('\n4️⃣ CHECKING ADMIN USER...');
  checkAdminUser();
}, 3000);

// Final summary
setTimeout(() => {
  console.log('\n🎯 DIAGNOSIS COMPLETE');
  console.log('=====================');
  console.log('If services are not running, the issue is:');
  console.log('1. Backend/Frontend not started properly');
  console.log('2. Wrong directory when running npm start');
  console.log('3. Database connection issues');
  console.log('\nSOLUTION:');
  console.log('1. Open 2 separate PowerShell windows');
  console.log('2. Window 1: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-backend" && npm start');
  console.log('3. Window 2: cd "C:\\Users\\Rakshit Sharma\\Desktop\\Fxeno\\xeno-dashboard" && npm start');
  console.log('4. Wait 30 seconds, then open http://localhost:3000');
}, 5000);

function checkPort(port, service) {
  const netstat = require('child_process').exec(`netstat -an | findstr :${port}`, (error, stdout, stderr) => {
    if (stdout.includes(`:${port}`)) {
      console.log(`   ✅ Port ${port} is in use (${service})`);
    } else {
      console.log(`   ❌ Port ${port} is NOT in use (${service} not running)`);
    }
  });
}

function checkBackendHealth() {
  const req = http.get('http://localhost:4000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('   ✅ Backend is responding');
        console.log('   📊 Health response:', data.trim());
      } else {
        console.log('   ❌ Backend returned status:', res.statusCode);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('   ❌ Backend is NOT running');
    console.log('   💡 Backend needs to be started');
  });
  
  req.setTimeout(3000, () => {
    console.log('   ⏰ Backend request timed out');
    req.destroy();
  });
}

function checkDatabase() {
  // This would require the backend to be running
  console.log('   ⚠️  Database check requires backend to be running');
}

function checkAdminUser() {
  // This would require the backend to be running
  console.log('   ⚠️  Admin user check requires backend to be running');
}
