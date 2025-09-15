@echo off
echo ========================================
echo    STARTING XENO FRONTEND DASHBOARD
echo ========================================
echo.

cd /d "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard"
echo Current directory: %CD%
echo.

echo Removing TypeScript dependencies...
npm uninstall typescript @types/node @types/react @types/react-dom @types/react-datepicker @types/jest
echo.

echo Installing dependencies...
npm install
echo.

echo Starting React development server...
echo This will take 30-60 seconds to compile...
echo Please wait...
npm start

pause
