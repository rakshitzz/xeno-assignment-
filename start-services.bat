@echo off
echo 🚀 Starting Multi-Tenant Dashboard Services
echo ==========================================

echo.
echo 1️⃣ Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\Rakshit^ Sharma\Desktop\Fxeno\xeno-backend && npm start"

echo.
echo 2️⃣ Starting Frontend Dashboard...
start "Frontend Dashboard" cmd /k "cd /d C:\Users\Rakshit^ Sharma\Desktop\Fxeno\xeno-dashboard && npm start"

echo.
echo ✅ Both services are starting in separate windows
echo.
echo 🌐 Open your browser and go to: http://localhost:3000
echo 🔑 Login with: admin@xeno.com / admin123
echo.
pause
