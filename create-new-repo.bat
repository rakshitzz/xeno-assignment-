@echo off
echo 🚀 Creating new clean repository for deployment...

REM Create a new directory for the clean repository
set REPO_NAME=xeno-dashboard-clean
if exist "%REPO_NAME%" (
    echo Directory %REPO_NAME% already exists. Removing it...
    rmdir /s /q "%REPO_NAME%"
)

echo Creating new directory: %REPO_NAME%
mkdir "%REPO_NAME%"
cd "%REPO_NAME%"

REM Initialize Git
echo Initializing Git repository...
git init

REM Copy essential files
echo Copying essential files...

REM Copy root files
copy "..\README.md" .
copy "..\RENDER_DEPLOYMENT_GUIDE.md" .
copy "..\deploy-render-vercel.bat" .
copy "..\.gitignore" .

REM Copy backend directory
echo Copying backend...
xcopy "..\xeno-backend" "xeno-backend\" /E /I /Y

REM Copy frontend directory
echo Copying frontend...
xcopy "..\xeno-dashboard" "xeno-dashboard\" /E /I /Y

REM Clean up backend directory
echo Cleaning backend directory...
cd xeno-backend
del /q test-*.js 2>nul
del /q check-*.js 2>nul
del /q debug-*.js 2>nul
del /q diagnose-*.js 2>nul
del /q quick-*.js 2>nul
del /q simple-*.js 2>nul
del /q verify-*.js 2>nul
del /q working-*.js 2>nul
del /q *-fix.js 2>nul
del /q *-sync.js 2>nul
del /q manage-*.js 2>nul
del /q setup-*.js 2>nul
del /q register-*.js 2>nul
del /q cron-*.js 2>nul
del /q force-*.js 2>nul
del /q run-*.js 2>nul
del /q start-*.bat 2>nul
del /q complete-backend.js 2>nul
del /q fixed-backend.js 2>nul
del /q neon-database-backend.js 2>nul
del /q real-shopify-backend.js 2>nul
del /q simple-database-backend.js 2>nul
del /q Dockerfile 2>nul
del /q railway.json 2>nul
rmdir /s /q data 2>nul
rmdir /s /q config 2>nul
rmdir /s /q lib 2>nul
rmdir /s /q src 2>nul
cd ..

REM Add all files to Git
echo Adding files to Git...
git add .

REM Commit
echo Committing changes...
git commit -m "Initial commit: Xeno Dashboard - Clean Repository

Features:
- Multi-tenant Shopify data ingestion
- RFM customer segmentation
- Interactive dashboard with charts
- Authentication system
- Production-ready deployment configs

Tech Stack:
- Backend: Node.js + Express + Prisma + PostgreSQL
- Frontend: React + Tailwind CSS + Recharts
- Deployment: Render + Vercel

Ready for deployment!"

echo ✅ New clean repository created successfully!
echo.
echo 📁 Repository structure:
echo    %REPO_NAME%/
echo    ├── README.md
echo    ├── RENDER_DEPLOYMENT_GUIDE.md
echo    ├── deploy-render-vercel.bat
echo    ├── .gitignore
echo    ├── xeno-backend/
echo    │   ├── production-backend.js
echo    │   ├── deploy-config.js
echo    │   ├── render.yaml
echo    │   ├── package.json
echo    │   └── prisma/
echo    └── xeno-dashboard/
echo        ├── src/
echo        ├── public/
echo        ├── package.json
echo        └── vercel.json
echo.
echo 🚀 Next steps:
echo 1. Create a new repository on GitHub
echo 2. Add remote: git remote add origin https://github.com/yourusername/your-repo.git
echo 3. Push: git push -u origin main
echo 4. Deploy using RENDER_DEPLOYMENT_GUIDE.md
echo.
echo 📍 Current directory: %CD%

pause
