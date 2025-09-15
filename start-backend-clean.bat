@echo off
echo ========================================
echo    STARTING XENO BACKEND SERVER
echo ========================================
echo.

cd /d "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend"
echo Current directory: %CD%
echo.

echo Starting backend server...
node -r ./lib/database.js src/server.js

pause
