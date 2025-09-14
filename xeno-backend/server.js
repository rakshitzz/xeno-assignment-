const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Xeno Dashboard Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Get available stores
app.get('/api/stores', (req, res) => {
  try {
    const stores = [
      { id: 'fashion-store', name: 'Fashion Store' },
      { id: 'books-store', name: 'Books Store' }
    ];
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Metrics endpoint with sample data
app.get('/api/metrics', (req, res) => {
  const { tenantId } = req.query;
  
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  // Sample data for demonstration
  const sampleData = {
    summary: {
      totalCustomers: 150,
      totalOrders: 89,
      totalRevenue: 45678.90,
      averageOrderValue: 512.35,
      repeatRate: 23.5,
      totalProducts: 45
    },
    topCustomers: [
      { name: 'John Doe', totalSpent: 1250.00, orders: 5 },
      { name: 'Jane Smith', totalSpent: 980.50, orders: 3 },
      { name: 'Mike Johnson', totalSpent: 750.25, orders: 4 }
    ],
    recentActivity: [
      { id: 1, type: 'order', description: 'New order #1234', amount: 125.50, timestamp: new Date().toISOString() },
      { id: 2, type: 'customer', description: 'New customer registered', amount: null, timestamp: new Date().toISOString() },
      { id: 3, type: 'order', description: 'Order #1233 completed', amount: 89.99, timestamp: new Date().toISOString() }
    ],
    ordersLast30Days: [
      { date: '2025-09-01', orders: 12, revenue: 1250.00 },
      { date: '2025-09-02', orders: 8, revenue: 890.50 },
      { date: '2025-09-03', orders: 15, revenue: 2100.75 }
    ],
    customerSegments: {
      vipChampions: { 
        count: 25, 
        customers: [
          { name: 'VIP Customer 1', totalOrders: 15, avgOrderValue: 850.00, totalSpent: 12750.00 },
          { name: 'VIP Customer 2', totalOrders: 12, avgOrderValue: 920.50, totalSpent: 11046.00 }
        ]
      },
      loyalLowValue: { 
        count: 45, 
        customers: [
          { name: 'Loyal Customer 1', totalOrders: 8, avgOrderValue: 45.00, totalSpent: 360.00 },
          { name: 'Loyal Customer 2', totalOrders: 6, avgOrderValue: 38.50, totalSpent: 231.00 }
        ]
      },
      bigTicket: { 
        count: 12, 
        customers: [
          { name: 'Big Spender 1', totalOrders: 2, avgOrderValue: 2500.00, totalSpent: 5000.00 },
          { name: 'Big Spender 2', totalOrders: 1, avgOrderValue: 1800.00, totalSpent: 1800.00 }
        ]
      },
      lowEngagement: { 
        count: 68, 
        customers: [
          { name: 'Low Engagement 1', totalOrders: 1, avgOrderValue: 25.00, totalSpent: 25.00 },
          { name: 'Low Engagement 2', totalOrders: 1, avgOrderValue: 15.50, totalSpent: 15.50 }
        ]
      }
    },
    segmentDistribution: {
      vipChampions: 25,
      loyalLowValue: 45,
      bigTicket: 12,
      lowEngagement: 68
    },
    rfmThresholds: {
      medianOrders: 3,
      medianAOV: 125.50
    }
  };

  res.json(sampleData);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Xeno Dashboard Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏪 Stores endpoint: http://localhost:${PORT}/api/stores`);
  console.log(`📈 Metrics endpoint: http://localhost:${PORT}/api/metrics`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
