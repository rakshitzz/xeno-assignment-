@echo off
echo 🚀 Starting Xeno Dashboard Deployment (Render + Vercel)...

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
    git commit -m "Deploy: Prepare for Render + Vercel deployment"
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
echo [STEP] 🚀 RENDER DEPLOYMENT (Backend)
echo [INFO] 1. Go to https://render.com
echo [INFO] 2. Sign in with GitHub
echo [INFO] 3. Click 'New +' → 'Web Service'
echo [INFO] 4. Connect your GitHub repository
echo [INFO] 5. Choose 'xeno-backend' folder as root directory
echo [INFO] 6. Configure:
echo [INFO]    - Name: xeno-backend
echo [INFO]    - Environment: Node
echo [INFO]    - Build Command: npm install
echo [INFO]    - Start Command: npm start
echo [INFO]    - Plan: Free
echo [INFO] 7. Set Environment Variables:
echo [INFO]    - DATABASE_URL: (your Neon database URL)
echo [INFO]    - NODE_ENV: production
echo [INFO]    - PORT: 10000
echo [INFO]    - JWT_SECRET: (generate a strong secret)
echo [INFO]    - FASHION_STORE_SHOP_DOMAIN: rakshit-xeno-test.myshopify.com
echo [INFO]    - FASHION_STORE_ACCESS_TOKEN: your_fashion_store_token_here
echo [INFO]    - BOOKS_STORE_SHOP_DOMAIN: book-store-xeno.myshopify.com
echo [INFO]    - BOOKS_STORE_ACCESS_TOKEN: your_books_store_token_here
echo [INFO]    - ELECTRONICS_STORE_SHOP_DOMAIN: electronics-store-xeno.myshopify.com
echo [INFO]    - ELECTRONICS_STORE_ACCESS_TOKEN: your_electronics_store_token_here
echo [INFO] 8. Click 'Create Web Service'
echo.
echo [STEP] 🎨 VERCEL DEPLOYMENT (Frontend)
echo [INFO] 1. Go to https://vercel.com
echo [INFO] 2. Sign in with GitHub
echo [INFO] 3. Click 'New Project' → 'Import Git Repository'
echo [INFO] 4. Select your repository
echo [INFO] 5. Set root directory to 'xeno-dashboard'
echo [INFO] 6. Set Environment Variable:
echo [INFO]    - REACT_APP_API_URL: https://your-backend-url.onrender.com
echo [INFO] 7. Click 'Deploy'
echo.
echo [INFO] 📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
echo [INFO] 🎯 After deployment, you'll have:
echo [INFO]    - Backend: https://your-backend.onrender.com
echo [INFO]    - Frontend: https://your-frontend.vercel.app
echo.
echo [INFO] 🚀 Ready to deploy!

pause
