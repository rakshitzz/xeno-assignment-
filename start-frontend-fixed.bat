@echo off
echo ========================================
echo    STARTING XENO FRONTEND DASHBOARD
echo ========================================
echo.

cd /d "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard"
echo Current directory: %CD%
echo.

echo Installing dependencies if needed...
npm install
if errorlevel 1 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo Starting React development server...
echo This will take 30-60 seconds to compile...
echo Please wait...
npm start

pause