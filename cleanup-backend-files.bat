@echo off
echo Cleaning up xeno-backend directory...

cd xeno-backend

echo Removing test files...
del /q test-*.js
del /q check-*.js
del /q debug-*.js
del /q verify-*.js
del /q quick-*.js
del /q simple-*.js
del /q diagnose-*.js
del /q force-*.js
del /q run-*.js
del /q manage-*.js
del /q register-*.js
del /q setup-*.js
del /q working-*.js
del /q complete-*.js
del /q final-*.js
del /q fix-*.js
del /q real-*.js
del /q neon-*.js
del /q cron-*.js
del /q sync-*.js
del /q start-*.bat

echo Removing old backend files...
del /q fixed-backend.js
del /q fixed-neon-backend.js
del /q production-backend.js
del /q deploy-config.js
del /q complete-backend.js
del /q simple-database-backend.js
del /q real-shopify-backend.js

echo Removing data directory...
rmdir /s /q data

echo Removing src directory...
rmdir /s /q src

echo Removing config directory...
rmdir /s /q config

echo Removing lib directory...
rmdir /s /q lib

echo Removing prisma directory...
rmdir /s /q prisma

echo Removing Dockerfile...
del /q Dockerfile

echo Removing railway.json...
del /q railway.json

echo Backend cleanup complete!
echo.
echo Remaining files:
dir /b

echo.
echo Backend is now clean with only essential files!
