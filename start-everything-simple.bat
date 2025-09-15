@echo off
echo ========================================
echo    STARTING XENO DASHBOARD SYSTEM
echo ========================================
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend && node -r ./lib/database.js src/server.js"

echo Waiting 5 seconds...
timeout /t 5 /nobreak > nul

echo Starting Frontend Dashboard...
start "Frontend" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard && npm start"

echo.
echo ========================================
echo    SYSTEM STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Login: admin@xeno.com / admin123
echo.
echo Wait 30-60 seconds for React to compile...
echo Then open: http://localhost:3000
echo.
pause

