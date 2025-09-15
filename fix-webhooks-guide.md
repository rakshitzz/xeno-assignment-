# 🔧 Fix Webhooks - Complete Guide

## 🚨 Current Problem
Shopify updates aren't syncing to your Neon database because webhooks can't reach your local server.

## ✅ Quick Fix: Use Manual Sync
1. Open your dashboard: http://localhost:3000
2. Login with: admin@xeno.com / admin123
3. Click "🔄 Sync Data" button
4. This will immediately sync all data from Shopify to Neon

## 🔧 Permanent Fix: Set Up Webhooks

### Step 1: Install ngrok
```bash
# Download from: https://ngrok.com/download
# Or install via npm:
npm install -g ngrok
```

### Step 2: Start Your Backend
```bash
# Run your dashboard
start-dashboard-complete.bat
```

### Step 3: Expose Your Local Server
```bash
# In a new terminal, run:
ngrok http 4000
```

### Step 4: Update Webhook URL
1. Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok.io)
2. Edit `xeno-backend/register-webhooks.js`
3. Change line 11 to:
```javascript
const WEBHOOK_URL = "https://YOUR-NGROK-URL.ngrok.io/webhooks/shopify";
```

### Step 5: Register Webhooks
```bash
cd xeno-backend
node register-webhooks.js
```

### Step 6: Test
1. Add a customer in Shopify admin
2. Check your backend logs for webhook processing
3. Verify data appears in your dashboard

## 🎯 Alternative: Use Manual Sync
The manual sync button works perfectly and syncs all data immediately. You can use this instead of webhooks for now.

## 📊 Current Status
- ✅ Database: Connected to Neon
- ✅ Shopify API: Working
- ✅ Manual Sync: Working
- ❌ Webhooks: Need public URL (ngrok)
