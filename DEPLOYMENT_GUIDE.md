# 🚀 Xeno Dashboard Deployment Guide

This guide will help you deploy your Xeno Dashboard to production using Railway (Backend) and Vercel (Frontend).

## 📋 Prerequisites

- GitHub account
- Railway account (free tier available)
- Vercel account (free tier available)
- Neon database (already configured)

## 🎯 Deployment Steps

### 1. Backend Deployment (Railway)

#### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure all files are committed

#### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the `xeno-backend` folder as the root directory

#### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:

```bash
# Database
DATABASE_URL=your_neon_database_url_here

# Server
PORT=4000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Shopify Store 1 (Fashion Store)
FASHION_STORE_SHOP_DOMAIN=rakshit-xeno-test.myshopify.com
FASHION_STORE_ACCESS_TOKEN=your_fashion_store_token_here
FASHION_STORE_TENANT_ID=fashion-store

# Shopify Store 2 (Books Store)
BOOKS_STORE_SHOP_DOMAIN=book-store-xeno.myshopify.com
BOOKS_STORE_ACCESS_TOKEN=your_books_store_token_here
BOOKS_STORE_TENANT_ID=books-store

# Shopify Store 3 (Electronics Store)
ELECTRONICS_STORE_SHOP_DOMAIN=electronics-store-xeno.myshopify.com
ELECTRONICS_STORE_ACCESS_TOKEN=your_electronics_store_token_here
ELECTRONICS_STORE_TENANT_ID=electronics-store
```

#### Step 4: Deploy
1. Railway will automatically build and deploy
2. Note the generated URL (e.g., `https://your-app.railway.app`)

### 2. Frontend Deployment (Vercel)

#### Step 1: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project" → "Import Git Repository"
4. Select your repository
5. Set the root directory to `xeno-dashboard`

#### Step 2: Configure Environment Variables
In Vercel dashboard, add:

```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
```

#### Step 3: Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Note the generated URL (e.g., `https://your-app.vercel.app`)

## 🔧 Manual Deployment Commands

### Railway CLI (Alternative)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd xeno-backend
railway deploy
```

### Vercel CLI (Alternative)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd xeno-dashboard
vercel --prod
```

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-09-14T...",
  "environment": "production"
}
```

### Frontend Access
1. Visit your Vercel URL
2. Login with: `admin@xeno.com` / `admin123`
3. Test all features

## 📊 Production URLs

After deployment, you'll have:
- **Backend API**: `https://your-backend.railway.app`
- **Frontend Dashboard**: `https://your-frontend.vercel.app`

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to Git
- Use strong JWT secrets in production
- Rotate Shopify access tokens regularly

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check environment variables are set
- Verify database connection
- Check Railway logs

#### Frontend Can't Connect
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings
- Test API endpoints directly

#### Database Connection Issues
- Verify `DATABASE_URL` format
- Check Neon database status
- Test connection locally first

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Test API locally
curl http://localhost:4000/health
```

## 📈 Monitoring

### Railway Monitoring
- Built-in metrics dashboard
- Log aggregation
- Performance monitoring

### Vercel Analytics
- Page views and performance
- Real user monitoring
- Core Web Vitals

## 🎯 Next Steps

1. **Domain Setup**: Configure custom domains
2. **SSL Certificates**: Automatic with Railway/Vercel
3. **Monitoring**: Set up alerts and notifications
4. **Backups**: Regular database backups
5. **Scaling**: Monitor usage and scale as needed

## 📞 Support

- Railway: [Railway Documentation](https://docs.railway.app)
- Vercel: [Vercel Documentation](https://vercel.com/docs)
- Neon: [Neon Documentation](https://neon.tech/docs)

---

**🎉 Congratulations! Your Xeno Dashboard is now live in production!**
