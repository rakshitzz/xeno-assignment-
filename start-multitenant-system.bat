@echo off
echo 🚀 Starting Multi-Tenant Shopify Analytics System
echo ================================================

echo.
echo 1️⃣ Starting Backend Server...
cd xeno-backend
start "Backend Server" cmd /k "npm start"

echo.
echo 2️⃣ Starting Frontend Dashboard...
cd ../xeno-dashboard
start "Frontend Dashboard" cmd /k "npm start"

echo.
echo ✅ Both services are starting...
echo.
echo 📊 Backend: http://localhost:4000
echo 🎨 Frontend: http://localhost:3000
echo.
echo 🔑 Login Credentials:
echo    Email: admin@xeno.com
echo    Password: admin123
echo.
echo 💡 Wait for both services to fully load, then open:
echo    http://localhost:3000
echo.
pause
