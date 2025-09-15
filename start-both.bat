@echo off
echo Starting Xeno Dashboard (Backend + Frontend)...
echo.

echo Starting Backend Server...
start "Xeno Backend" cmd /k "cd /d \"C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend\" && npm run start"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Dashboard...
start "Xeno Frontend" cmd /k "cd /d \"C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard\" && node node_modules/react-scripts/bin/react-scripts.js start"

echo.
echo ✅ Both servers are starting!
echo.
echo 🌐 Backend API: http://localhost:4000
echo 🌐 Frontend: http://localhost:3000
echo.
echo 🔐 Login with:
echo    Email: admin@xeno.com
echo    Password: admin123
echo.
echo Press any key to close this window...
pause > nul
