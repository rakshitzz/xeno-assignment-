#!/bin/bash

# Xeno Dashboard Deployment Script - Render + Vercel
echo "🚀 Starting Xeno Dashboard Deployment (Render + Vercel)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected. Committing all changes..."
    git add .
    git commit -m "Deploy: Prepare for Render + Vercel deployment"
fi

print_status "✅ Repository is ready for deployment"

# Build frontend
print_status "Building frontend..."
cd xeno-dashboard
npm run build
if [ $? -eq 0 ]; then
    print_status "✅ Frontend build successful"
else
    print_error "❌ Frontend build failed"
    exit 1
fi
cd ..

print_status "🎯 Deployment preparation complete!"
print_status ""
print_step "🚀 RENDER DEPLOYMENT (Backend)"
print_status "1. Go to https://render.com"
print_status "2. Sign in with GitHub"
print_status "3. Click 'New +' → 'Web Service'"
print_status "4. Connect your GitHub repository"
print_status "5. Choose 'xeno-backend' folder as root directory"
print_status "6. Configure:"
print_status "   - Name: xeno-backend"
print_status "   - Environment: Node"
print_status "   - Build Command: npm install"
print_status "   - Start Command: npm start"
print_status "   - Plan: Free"
print_status "7. Set Environment Variables:"
print_status "   - DATABASE_URL: (your Neon database URL)"
print_status "   - NODE_ENV: production"
print_status "   - PORT: 10000"
print_status "   - JWT_SECRET: (generate a strong secret)"
print_status "   - FASHION_STORE_SHOP_DOMAIN: rakshit-xeno-test.myshopify.com"
print_status "   - FASHION_STORE_ACCESS_TOKEN: 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"
print_status "   - BOOKS_STORE_SHOP_DOMAIN: book-store-xeno.myshopify.com"
print_status "   - BOOKS_STORE_ACCESS_TOKEN: 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"
print_status "8. Click 'Create Web Service'"
print_status ""
print_step "🎨 VERCEL DEPLOYMENT (Frontend)"
print_status "1. Go to https://vercel.com"
print_status "2. Sign in with GitHub"
print_status "3. Click 'New Project' → 'Import Git Repository'"
print_status "4. Select your repository"
print_status "5. Set root directory to 'xeno-dashboard'"
print_status "6. Set Environment Variable:"
print_status "   - REACT_APP_API_URL: https://your-backend-url.onrender.com"
print_status "7. Click 'Deploy'"
print_status ""
print_status "📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"
print_status ""
print_status "🎯 After deployment, you'll have:"
print_status "   - Backend: https://your-backend.onrender.com"
print_status "   - Frontend: https://your-frontend.vercel.app"
print_status ""
print_status "🚀 Ready to deploy!"

echo ""
read -p "Press Enter to continue..."
