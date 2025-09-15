# Xeno Dashboard

A comprehensive Shopify analytics dashboard with email authentication and real-time data visualization.

## Features

### 🔐 Authentication
- Email-based login system
- JWT token authentication
- Demo credentials: `admin@xeno.com` / `admin123`

### 📊 Analytics & Metrics
- **KPI Cards**: Total customers, products, orders, revenue, average order value
- **Interactive Charts**: Orders by date, revenue trends, top customers
- **Date Range Filtering**: Analyze data for specific time periods
- **Top 5 Customers**: Visual ranking by spending with detailed breakdowns

### 📈 Business Intelligence
- Real-time sync with Shopify data
- Comprehensive data tables for customers, products, and orders
- Responsive design for mobile and desktop
- Modern UI with Tailwind CSS

### 🔄 Data Management
- Manual sync controls for each data type
- Live data verification from Shopify API
- Automatic data refresh capabilities

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API communication
- **React DatePicker** for date range selection

### Backend
- **Node.js** with Express.js
- **Prisma ORM** with PostgreSQL (Neon)
- **JWT** for authentication
- **bcrypt** for password hashing
- **Shopify Admin API** integration

## Quick Start

### Option 1: Use the Startup Script
```bash
# Run this from the project root
start-dashboard.bat
```

### Option 2: Manual Setup

1. **Start the Backend** (Terminal 1):
```bash
cd xeno-backend
npm run start
```

2. **Start the Frontend** (Terminal 2):
```bash
cd xeno-dashboard
npm start
```

3. **Access the Dashboard**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Login Credentials

**Demo Account:**
- Email: `admin@xeno.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Data Sync
- `POST /sync/customers` - Sync customer data
- `POST /sync/products` - Sync product data  
- `POST /sync/orders` - Sync order data

### Analytics
- `GET /metrics/summary` - Dashboard KPI summary
- `GET /metrics/orders-by-date` - Orders timeline data
- `GET /metrics/top-customers` - Top customers by spending
- `GET /metrics/customers` - All customer data
- `GET /metrics/products` - All product data

## Dashboard Sections

### 1. Overview Tab
- **KPI Cards**: Key business metrics with sync controls
- **Top 5 Customers**: Visual breakdown of highest-value customers

### 2. Analytics Tab  
- **Date Range Picker**: Filter data by custom date ranges
- **Orders Charts**: Multiple chart types showing order trends and revenue

### 3. Data Tables Tab
- **Customer Table**: Detailed customer information
- **Product Table**: Product catalog with pricing
- **Order Table**: Complete order history

## Features in Detail

### KPI Cards
- Total Customers with sync button
- Total Products with sync button  
- Total Orders with sync button
- Total Revenue calculation
- Average Order Value
- Recent Orders (last 30 days)

### Charts & Visualizations
- **Bar Charts**: Orders count by date
- **Line Charts**: Revenue trends over time
- **Pie Charts**: Customer spending distribution
- **Combined Charts**: Orders and revenue correlation

### Date Range Filtering
- Custom date picker with start/end dates
- Quick select presets (7, 30, 90, 365 days)
- Real-time chart updates based on selected range

### Data Tables
- Sortable columns
- Pagination for large datasets
- Responsive design
- Export capabilities (future enhancement)

## Security

- JWT tokens with 24-hour expiration
- Bcrypt password hashing
- Protected API endpoints
- CORS configuration for cross-origin requests

## Performance

- Database views for optimized queries
- Efficient data pagination
- Lazy loading for large datasets
- Responsive chart rendering

## Future Enhancements

- Real-time webhooks integration
- Advanced filtering and search
- Data export functionality
- Mobile app version
- Multi-user support with roles
- Email notifications and alerts
