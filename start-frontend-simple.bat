@echo off
echo ========================================
echo    STARTING XENO FRONTEND DASHBOARD
echo ========================================
echo.

cd /d "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard"
echo Current directory: %CD%
echo.

echo Starting React development server...
echo This will take 30-60 seconds to compile...
echo Please wait...
echo.

npm start

echo.
echo If the window closes, there was an error.
echo Check the error message above.
pause
