@echo off
echo Starting Both Services...
echo ===========================
echo.

echo Starting Backend (Real Shopify Data)...
start "Backend Server" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend && node real-shopify-backend.js"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend (Dashboard)...
start "Frontend Dashboard" cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard && npm start"

echo.
echo Both services are starting!
echo.
echo URLs:
echo   - Backend: http://localhost:4000
echo   - Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   - Email: admin@xeno.com
echo   - Password: admin123
echo.
echo You'll see REAL data from your Shopify stores!
echo.
pause
