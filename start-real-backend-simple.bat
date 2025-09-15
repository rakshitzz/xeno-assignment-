@echo off
echo 🚀 Starting Real Shopify Backend...
echo ===================================
echo.

cd /d "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend"

echo Current directory: %CD%
echo.

echo Installing node-fetch if needed...
npm install node-fetch --silent

echo.
echo Starting backend server...
echo Backend will run on: http://localhost:4000
echo Frontend should be on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node real-shopify-backend.js
