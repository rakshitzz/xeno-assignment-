# 🚀 Quick Start Guide - Multi-Tenant Shopify Analytics

## ✅ Your System is Ready!

### Step 1: Start Backend Server
```bash
# Open Terminal 1
cd xeno-backend
npm start
```
**Expected output:** `🚀 Xeno FDE Assignment Server running on port 4000`

### Step 2: Start Frontend Dashboard
```bash
# Open Terminal 2 (new terminal)
cd xeno-dashboard
npm start
```
**Expected output:** `webpack compiled` and opens browser at `http://localhost:3000`

### Step 3: Login to Dashboard
1. Open **http://localhost:3000** in your browser
2. Login with:
   - **Email:** `admin@xeno.com`
   - **Password:** `admin123`

### Step 4: Select a Store
1. Use the **"Select Store"** dropdown
2. Choose from:
   - **Fashion Store (Original)** - 26 customers, 41 products
   - **Electronics Store** - Ready for data
   - **Books Store** - Ready for data

## 🎯 What You Can Do

- **View Analytics** - See tenant-specific data
- **Switch Stores** - Change between different stores
- **Sync Data** - Click sync button to update from Shopify
- **Toggle Theme** - Switch between dark/light modes
- **Filter Orders** - Use date range filters

## 🔧 Troubleshooting

### If "Choose a Store" is not working:
1. Make sure backend is running on port 4000
2. Check browser console for errors
3. Verify you're logged in successfully

### If services won't start:
1. Make sure you're in the correct directory
2. Run `npm install` if needed
3. Check for port conflicts

## 📊 Current Data Status

| Store | Customers | Products | Orders |
|-------|-----------|----------|--------|
| Fashion Store | 26 | 41 | 0 |
| Electronics Store | 0 | 0 | 0 |
| Books Store | 0 | 0 | 0 |

## 🎉 Your Multi-Tenant System is Live!

**Backend:** http://localhost:4000  
**Frontend:** http://localhost:3000  
**Login:** admin@xeno.com / admin123
