@echo off
echo Starting Xeno Dashboard...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd xeno-backend && npm run start"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Dashboard...
start "Frontend" cmd /k "cd xeno-dashboard && npm start"

echo.
echo Dashboard is starting up!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Login with:
echo Email: admin@xeno.com
echo Password: admin123
echo.
pause
