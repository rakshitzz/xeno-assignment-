@echo off
echo 🚀 Pushing cleaned repository to Git...

REM Initialize Git if not already initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
)

REM Add all files
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Clean repository for deployment - Xeno Dashboard

- Removed unnecessary test files and batch scripts
- Kept only essential files for deployment
- Added deployment configurations for Render + Vercel
- Added comprehensive documentation
- Ready for production deployment"

REM Check if remote exists
git remote -v > temp_remote.txt 2>nul
if %errorlevel%==0 (
    echo Remote repository found.
    echo Pushing to remote...
    git push origin main
) else (
    echo No remote repository configured.
    echo Please add a remote repository:
    echo git remote add origin https://github.com/yourusername/your-repo.git
    echo git push -u origin main
)

del temp_remote.txt

echo ✅ Git operations completed!
echo.
echo 📋 Next steps:
echo 1. If no remote was found, add your GitHub repository:
echo    git remote add origin https://github.com/yourusername/your-repo.git
echo    git push -u origin main
echo.
echo 2. Deploy to Render + Vercel using the deployment guide
echo.
echo 🚀 Repository is ready for deployment!

pause
