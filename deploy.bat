@echo off
echo 🚀 Starting Xeno Dashboard Deployment...

REM Check if git is initialized
if not exist ".git" (
    echo [ERROR] Git repository not initialized. Please run 'git init' first.
    exit /b 1
)

REM Check if files are committed
git status --porcelain > temp_status.txt
if not %errorlevel%==0 (
    echo [ERROR] Git status check failed
    exit /b 1
)

for /f %%i in (temp_status.txt) do (
    echo [WARNING] Uncommitted changes detected. Committing all changes...
    git add .
    git commit -m "Deploy: Prepare for production deployment"
    goto :committed
)
:committed
del temp_status.txt

echo [INFO] ✅ Repository is ready for deployment

REM Build frontend
echo [INFO] Building frontend...
cd xeno-dashboard
call npm run build
if %errorlevel%==0 (
    echo [INFO] ✅ Frontend build successful
) else (
    echo [ERROR] ❌ Frontend build failed
    exit /b 1
)
cd ..

echo [INFO] 🎯 Deployment preparation complete!
echo.
echo [INFO] Next steps:
echo [INFO] 1. Push to GitHub: git push origin main
echo [INFO] 2. Deploy backend to Railway:
echo [INFO]    - Go to https://railway.app
echo [INFO]    - Connect your GitHub repo
echo [INFO]    - Set environment variables (see DEPLOYMENT_GUIDE.md)
echo [INFO] 3. Deploy frontend to Vercel:
echo [INFO]    - Go to https://vercel.com
echo [INFO]    - Connect your GitHub repo
echo [INFO]    - Set REACT_APP_API_URL environment variable
echo.
echo [INFO] 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
echo [INFO] 🚀 Ready to deploy!

pause
