@echo off
echo Starting Xeno Backend Server...
cd /d "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend"
echo Current directory: %CD%
echo.
echo Starting server with: node -r ./lib/database.js src/server.js
node -r ./lib/database.js src/server.js
