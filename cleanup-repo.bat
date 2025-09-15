@echo off
echo 🧹 Cleaning up repository for deployment...

REM Remove unnecessary test files
del /q test-*.js
del /q test-*.ps1
del /q check-*.js
del /q diagnose-*.js
del /q deep-*.js
del /q fix-*.js
del /q quick-*.js
del /q create-*.js
del /q auto-*.html
del /q simple-*.html
del /q index.js

REM Remove unnecessary batch files
del /q start-*.bat
del /q start-*.ps1
del /q auto-*.bat
del /q auto-*.ps1
del /q compile_*.bat

REM Remove unnecessary documentation files
del /q Academic_*.md
del /q Synopsis_*.md
del /q Synopsis_*.tex
del /q data_flow_*.tex
del /q system_architecture.tex
del /q fix-webhooks-guide.md

REM Remove unnecessary config files
rmdir /s /q config
rmdir /s /q lib

REM Remove unnecessary root files
del /q package.json
del /q package-lock.json
rmdir /s /q node_modules
rmdir /s /q prisma

echo ✅ Repository cleaned up!
echo.
echo 📁 Essential files remaining:
echo    - xeno-backend/ (Backend application)
echo    - xeno-dashboard/ (Frontend application)
echo    - README.md (Main documentation)
echo    - RENDER_DEPLOYMENT_GUIDE.md (Deployment guide)
echo    - deploy-render-vercel.bat (Deployment script)
echo    - .gitignore (Git ignore file)
echo.
echo 🚀 Repository is now clean and ready for deployment!

pause
