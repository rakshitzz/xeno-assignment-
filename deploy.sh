#!/bin/bash

# Xeno Dashboard Deployment Script
echo "🚀 Starting Xeno Dashboard Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected. Committing all changes..."
    git add .
    git commit -m "Deploy: Prepare for production deployment"
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

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_status "🎯 Deployment preparation complete!"
print_status ""
print_status "Next steps:"
print_status "1. Push to GitHub: git push origin main"
print_status "2. Deploy backend to Railway:"
print_status "   - Go to https://railway.app"
print_status "   - Connect your GitHub repo"
print_status "   - Set environment variables (see DEPLOYMENT_GUIDE.md)"
print_status "3. Deploy frontend to Vercel:"
print_status "   - Go to https://vercel.com"
print_status "   - Connect your GitHub repo"
print_status "   - Set REACT_APP_API_URL environment variable"
print_status ""
print_status "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"

echo ""
print_status "🚀 Ready to deploy!"
