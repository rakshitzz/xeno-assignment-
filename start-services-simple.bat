@echo off
echo Starting Services...
echo ====================

echo Starting Backend...
start cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard"

echo.
echo Two command windows opened.
echo In the first window, run: node real-shopify-backend.js
echo In the second window, run: npm start
echo.
echo Then go to: http://localhost:3000
echo Login: admin@xeno.com / admin123
echo.
pause
