@echo off
echo 🧹 Cleaning up entire repository for deployment...

REM Clean root directory
echo Cleaning root directory...
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
del /q start-*.bat
del /q start-*.ps1
del /q auto-*.bat
del /q auto-*.ps1
del /q compile_*.bat
del /q Academic_*.md
del /q Synopsis_*.md
del /q Synopsis_*.tex
del /q data_flow_*.tex
del /q system_architecture.tex
del /q fix-webhooks-guide.md
del /q QUICK_START.md
del /q DEPLOYMENT_GUIDE.md
del /q deploy.bat
del /q deploy.sh
rmdir /s /q config
rmdir /s /q lib
rmdir /s /q node_modules
rmdir /s /q prisma
del /q package.json
del /q package-lock.json

REM Clean backend directory
echo Cleaning backend directory...
cd xeno-backend
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
del /q complete-backend.js
del /q fixed-backend.js
del /q neon-database-backend.js
del /q real-shopify-backend.js
del /q simple-database-backend.js
del /q Dockerfile
del /q railway.json
rmdir /s /q data
rmdir /s /q config
rmdir /s /q lib
rmdir /s /q src
cd ..

echo ✅ Repository completely cleaned up!
echo.
echo 📁 Essential files remaining:
echo.
echo Root:
echo    - README.md
echo    - RENDER_DEPLOYMENT_GUIDE.md
echo    - deploy-render-vercel.bat
echo    - .gitignore
echo.
echo xeno-backend/:
echo    - production-backend.js
echo    - deploy-config.js
echo    - render.yaml
echo    - package.json
echo    - package-lock.json
echo    - prisma/
echo.
echo xeno-dashboard/:
echo    - src/
echo    - public/
echo    - package.json
echo    - package-lock.json
echo    - vercel.json
echo    - tailwind.config.js
echo    - postcss.config.js
echo.
echo 🚀 Repository is now clean and ready for deployment!

pause
