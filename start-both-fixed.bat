@echo off
echo ========================================
echo    STARTING XENO DASHBOARD SYSTEM
echo ========================================
echo.

echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend && node -r ./lib/database.js src/server.js"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Step 2: Starting Frontend Dashboard...
start "Frontend Dashboard" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard && npm start"

echo.
echo ========================================
echo    DASHBOARD STARTUP COMPLETE!
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo Email:    admin@xeno.com
echo Password: admin123
echo.
echo Wait 30-60 seconds for React to compile...
echo Then open: http://localhost:3000
echo.
pause