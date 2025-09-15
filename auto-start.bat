@echo off
echo 🚀 AUTO-STARTING MULTI-TENANT DASHBOARD
echo ======================================

echo.
echo 1️⃣ Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\Rakshit^ Sharma\Desktop\Fxeno\xeno-backend && echo Starting Backend... && npm start"

echo.
echo 2️⃣ Starting Frontend Dashboard...
start "Frontend Dashboard" cmd /k "cd /d C:\Users\Rakshit^ Sharma\Desktop\Fxeno\xeno-dashboard && echo Starting Frontend... && npm start"

echo.
echo 3️⃣ Creating Admin User...
cd /d C:\Users\Rakshit^ Sharma\Desktop\Fxeno\xeno-backend
node fix-login.js

echo.
echo ✅ SERVICES ARE STARTING...
echo ==========================
echo.
echo 🌐 Open your browser and go to: http://localhost:3000
echo 🔑 Login credentials will be automatically filled:
echo    Email: admin@xeno.com
echo    Password: admin123
echo.
echo ⏳ Wait 30 seconds for both services to fully start
echo.
pause
