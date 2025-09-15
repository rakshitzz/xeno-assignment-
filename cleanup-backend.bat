@echo off
echo 🧹 Cleaning up backend folder...

cd xeno-backend

REM Remove test files
del /q test-*.js
del /q check-*.js
del /q debug-*.js
del /q diagnose-*.js
del /q quick-*.js
del /q simple-*.js
del /q verify-*.js
del /q working-*.js
del /q *-fix.js
del /q *-sync.js
del /q manage-*.js
del /q setup-*.js
del /q register-*.js
del /q cron-*.js
del /q force-*.js
del /q run-*.js
del /q start-*.bat

REM Remove unnecessary backend files
del /q complete-backend.js
del /q fixed-backend.js
del /q neon-database-backend.js
del /q real-shopify-backend.js
del /q simple-database-backend.js

REM Remove data folder
rmdir /s /q data

REM Remove config folder
rmdir /s /q config

REM Remove lib folder
rmdir /s /q lib

REM Remove src folder (not needed for production)
rmdir /s /q src

REM Remove Dockerfile (not needed for Render)
del /q Dockerfile

REM Remove railway.json (using Render instead)
del /q railway.json

cd ..

echo ✅ Backend folder cleaned up!
echo.
echo 📁 Essential backend files remaining:
echo    - production-backend.js (Main backend file)
echo    - deploy-config.js (Environment configuration)
echo    - render.yaml (Render deployment config)
echo    - package.json (Dependencies)
echo    - package-lock.json (Lock file)
echo    - prisma/ (Database schema)
echo.
echo 🚀 Backend is now clean and ready for deployment!

pause
