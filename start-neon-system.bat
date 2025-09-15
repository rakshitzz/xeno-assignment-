@echo off
echo 🚀 Starting Neon Database System...
echo.

echo 📊 Starting Backend (Neon Database)...
start "Backend" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend && node neon-database-backend.js"

echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo 🌐 Starting Frontend...
start "Frontend" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard && npm start"

echo.
echo ✅ Both services starting...
echo 🌐 Frontend: http://localhost:3000
echo 📊 Backend: http://localhost:4000
echo 🔑 Login: admin@xeno.com / admin123
echo.
echo 💾 Data will be saved to Neon database!
echo 🔄 New customers will sync automatically!
echo.
pause
