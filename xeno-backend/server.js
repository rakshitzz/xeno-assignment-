const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Load database configuration
const databaseConfig = require('./database.json');

// Set environment variables for Prisma
process.env.DATABASE_URL = databaseConfig.database.pooler.url;
process.env.DIRECT_URL = databaseConfig.database.direct.url;
process.env.PRISMA_CLIENT_ENGINE_TYPE = databaseConfig.database.prisma.clientEngineType;

// Shopify API configuration - REAL STORE DETAILS WITH NEW TOKENS
const SHOPIFY_CONFIG = {
  'books-store': {
    domain: 'book-store-xeno.myshopify.com',
    accessToken: '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',
    apiVersion: '2023-10'
  },
  'electronics-store': {
    domain: 'electronics-store-xeno.myshopify.com',
    accessToken: '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',
    apiVersion: '2023-10'
  },
  'fashion-store': {
    domain: 'rakshit-xeno-test.myshopify.com',
    accessToken: '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',
    apiVersion: '2023-10'
  }
};

// Helper function to make Shopify API calls
async function shopifyRequest(storeId, endpoint, options = {}) {
  const config = SHOPIFY_CONFIG[storeId];
  if (!config) {
    throw new Error(`Store ${storeId} not found`);
  }

  const url = `https://${config.domain}/admin/api/${config.apiVersion}/${endpoint}`;
  const headers = {
    'X-Shopify-Access-Token': config.accessToken,
    'Content-Type': 'application/json',
    ...options.headers
  };

  console.log(`🔗 Making request to: ${url}`);
  console.log(`🔑 Using token: ${config.accessToken.substring(0, 10)}...`);

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Shopify API Error: ${response.status} ${response.statusText}`);
    console.error(`❌ Error details: ${errorText}`);
    throw new Error(`Shopify API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

// Sync customers from Shopify
async function syncCustomers(tenantId) {
  try {
    console.log(`🔄 Syncing customers for tenant: ${tenantId}`);
    
    const config = SHOPIFY_CONFIG[tenantId];
    if (!config) {
      throw new Error(`Store ${tenantId} not found`);
    }

    // Get or create tenant
    let tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          id: tenantId,
          name: tenantId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          shopifyDomain: config.domain,
          accessToken: config.accessToken,
          apiVersion: config.apiVersion
        }
      });
    }

    // Fetch customers from Shopify
    const customersData = await shopifyRequest(tenantId, 'customers.json?limit=250');
    const customers = customersData.customers || [];

    console.log(`📊 Found ${customers.length} customers in Shopify`);

    // Sync customers to database
    for (const customer of customers) {
      await prisma.customer.upsert({
        where: {
          tenantId_shopifyId: {
            tenantId: tenantId,
            shopifyId: customer.id.toString()
          }
        },
        update: {
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          totalSpent: parseFloat(customer.total_spent || 0),
          ordersCount: parseInt(customer.orders_count || 0)
        },
        create: {
          tenantId: tenantId,
          shopifyId: customer.id.toString(),
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          totalSpent: parseFloat(customer.total_spent || 0),
          ordersCount: parseInt(customer.orders_count || 0)
        }
      });
    }

    console.log(`✅ Synced ${customers.length} customers successfully`);
    return { success: true, count: customers.length };

  } catch (error) {
    console.error('❌ Error syncing customers:', error);
    throw error;
  }
}

// Sync orders from Shopify
async function syncOrders(tenantId) {
  try {
    console.log(`🔄 Syncing orders for tenant: ${tenantId}`);
    
    // Fetch orders from Shopify
    const ordersData = await shopifyRequest(tenantId, 'orders.json?limit=250&status=any');
    const orders = ordersData.orders || [];

    console.log(`📊 Found ${orders.length} orders in Shopify`);

    // Sync orders to database
    for (const order of orders) {
      // Find customer
      let customer = null;
      if (order.customer) {
        customer = await prisma.customer.findUnique({
          where: {
            tenantId_shopifyId: {
              tenantId: tenantId,
              shopifyId: order.customer.id.toString()
            }
          }
        });
      }

      // Create/update order
      await prisma.order.upsert({
        where: {
          tenantId_shopifyId: {
            tenantId: tenantId,
            shopifyId: order.id.toString()
          }
        },
        update: {
          customerId: customer?.id,
          orderNumber: order.name,
          totalPrice: parseFloat(order.total_price || 0),
          currency: order.currency || 'USD',
          status: order.financial_status || 'pending'
        },
        create: {
          tenantId: tenantId,
          shopifyId: order.id.toString(),
          customerId: customer?.id,
          orderNumber: order.name,
          totalPrice: parseFloat(order.total_price || 0),
          currency: order.currency || 'USD',
          status: order.financial_status || 'pending'
        }
      });
    }

    console.log(`✅ Synced ${orders.length} orders successfully`);
    return { success: true, count: orders.length };

  } catch (error) {
    console.error('❌ Error syncing orders:', error);
    throw error;
  }
}

// Sync products from Shopify
async function syncProducts(tenantId) {
  try {
    console.log(`🔄 Syncing products for tenant: ${tenantId}`);
    
    // Fetch products from Shopify
    const productsData = await shopifyRequest(tenantId, 'products.json?limit=250');
    const products = productsData.products || [];

    console.log(`📊 Found ${products.length} products in Shopify`);

    // Sync products to database
    for (const product of products) {
      await prisma.product.upsert({
        where: {
          tenantId_shopifyId: {
            tenantId: tenantId,
            shopifyId: product.id.toString()
          }
        },
        update: {
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          productType: product.product_type,
          status: product.status
        },
        create: {
          tenantId: tenantId,
          shopifyId: product.id.toString(),
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          productType: product.product_type,
          status: product.status
        }
      });
    }

    console.log(`✅ Synced ${products.length} products successfully`);
    return { success: true, count: products.length };

  } catch (error) {
    console.error('❌ Error syncing products:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Xeno Dashboard Backend with Real Shopify Data is running',
    timestamp: new Date().toISOString()
  });
});

// Stores endpoint
app.get('/api/stores', (req, res) => {
  try {
    const stores = Object.keys(SHOPIFY_CONFIG).map(id => ({
      id: id,
      name: id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
    res.json(stores);
  } catch (error) {
    console.error('Stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Metrics endpoint with real data from Neon database
app.get('/api/metrics', async (req, res) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Get real data from database
    const [
      totalCustomers,
      totalOrders,
      totalRevenue,
      customers,
      orders,
      products
    ] = await Promise.all([
      prisma.customer.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId } }),
      prisma.order.aggregate({
        where: { tenantId },
        _sum: { totalPrice: true }
      }),
      prisma.customer.findMany({
        where: { tenantId },
        orderBy: { totalSpent: 'desc' },
        take: 10
      }),
      prisma.order.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { customer: true }
      }),
      prisma.product.count({ where: { tenantId } })
    ]);

    // Calculate metrics
    const averageOrderValue = totalOrders > 0 ? totalRevenue._sum.totalPrice / totalOrders : 0;
    
    // Calculate repeat rate
    const customersWithMultipleOrders = await prisma.customer.count({
      where: {
        tenantId,
        ordersCount: { gt: 1 }
      }
    });
    const repeatRate = totalCustomers > 0 ? (customersWithMultipleOrders / totalCustomers) * 100 : 0;

    // RFM Analysis - Get customers with their orders
    const customerMetrics = await prisma.customer.findMany({
      where: { tenantId },
      include: {
        orders: {
          select: {
            totalPrice: true,
            createdAt: true,
            orderNumber: true
          }
        }
      }
    });

    // Calculate RFM metrics for each customer
    const rfmData = customerMetrics.map(customer => {
      const orders = customer.orders;
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const lastOrderDate = orders.length > 0 ? new Date(Math.max(...orders.map(o => new Date(o.createdAt)))) : null;
      const daysSinceLastOrder = lastOrderDate ? Math.floor((new Date() - lastOrderDate) / (1000 * 60 * 60 * 24)) : 999;

      return {
        customerId: customer.id,
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email || 'Guest Customer',
        totalOrders,
        totalSpent,
        avgOrderValue,
        daysSinceLastOrder
      };
    });

    // Calculate thresholds (percentile-based for better segmentation)
    const orderCounts = rfmData.map(c => c.totalOrders).sort((a, b) => a - b);
    const aovs = rfmData.map(c => c.avgOrderValue).sort((a, b) => a - b);
    
    // Handle empty data gracefully
    if (rfmData.length === 0) {
      const response = {
        summary: {
          totalCustomers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          repeatRate: 0,
          totalProducts: 0
        },
        topCustomers: [],
        recentActivity: [],
        customerSegments: {
          vipChampions: { title: 'VIP Champions', description: 'High frequency, high value customers', icon: '👑', color: '#10B981', action: 'Retain & Upsell', count: 0, customers: [] },
          loyalLowValue: { title: 'Loyal Low-Value', description: 'High frequency, low value customers', icon: '🔄', color: '#3B82F6', action: 'Increase AOV', count: 0, customers: [] },
          bigTicket: { title: 'Big-Ticket Customers', description: 'Low frequency, high value customers', icon: '💎', color: '#F59E0B', action: 'Increase Frequency', count: 0, customers: [] },
          lowEngagement: { title: 'Low Engagement', description: 'Low frequency, low value customers', icon: '📉', color: '#EF4444', action: 'Re-engage', count: 0, customers: [] }
        },
        segmentDistribution: {
          vipChampions: 0,
          loyalLowValue: 0,
          bigTicket: 0,
          lowEngagement: 0
        },
        rfmThresholds: {
          highFrequencyThreshold: 2,
          highAOVThreshold: 100,
          lowFrequencyThreshold: 1,
          lowAOVThreshold: 50
        }
      };
      return res.json(response);
    }
    
    // Use 75th percentile for "high" thresholds (more meaningful segmentation)
    const highFrequencyThreshold = orderCounts[Math.floor(orderCounts.length * 0.75)] || 2;
    const highAOVThreshold = aovs[Math.floor(aovs.length * 0.75)] || 100;
    
    // Use 25th percentile for "low" thresholds
    const lowFrequencyThreshold = orderCounts[Math.floor(orderCounts.length * 0.25)] || 1;
    const lowAOVThreshold = aovs[Math.floor(aovs.length * 0.25)] || 50;

    // Segment customers
    const segments = {
      vipChampions: [],
      loyalLowValue: [],
      bigTicket: [],
      lowEngagement: []
    };

    rfmData.forEach(customer => {
      const isHighFrequency = customer.totalOrders >= highFrequencyThreshold;
      const isHighAOV = customer.avgOrderValue >= highAOVThreshold;

      if (isHighFrequency && isHighAOV) {
        segments.vipChampions.push(customer);
      } else if (isHighFrequency && !isHighAOV) {
        segments.loyalLowValue.push(customer);
      } else if (!isHighFrequency && isHighAOV) {
        segments.bigTicket.push(customer);
      } else {
        segments.lowEngagement.push(customer);
      }
    });

    // Prepare response
    const response = {
      summary: {
        totalCustomers,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        repeatRate: Math.round(repeatRate * 100) / 100,
        totalProducts: products
      },
      topCustomers: customers.slice(0, 5).map(c => ({
        name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email || 'Guest Customer',
        email: c.email || 'No email',
        totalSpent: c.totalSpent,
        ordersCount: c.ordersCount,
        avgOrderValue: c.ordersCount > 0 ? Math.round((c.totalSpent / c.ordersCount) * 100) / 100 : 0
      })),
      recentActivity: orders.slice(0, 5).map(order => ({
        id: order.id,
        type: 'order',
        description: `Order ${order.orderNumber}`,
        amount: order.totalPrice,
        timestamp: order.createdAt.toISOString(),
        customerName: order.customer ? 
          `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 
          order.customer.email || 'Guest Customer' : 'Guest Customer',
        date: order.createdAt.toLocaleDateString()
      })),
      customerSegments: {
        vipChampions: {
          title: 'VIP Champions',
          description: 'High frequency, high value customers',
          icon: '👑',
          color: '#10B981',
          action: 'Retain & Upsell',
          count: segments.vipChampions.length,
          customers: segments.vipChampions.slice(0, 5).map(c => ({
            name: c.name,
            totalOrders: c.totalOrders,
            avgOrderValue: Math.round(c.avgOrderValue * 100) / 100,
            totalSpent: Math.round(c.totalSpent * 100) / 100
          }))
        },
        loyalLowValue: {
          title: 'Loyal Low-Value',
          description: 'High frequency, low value customers',
          icon: '🔄',
          color: '#3B82F6',
          action: 'Increase AOV',
          count: segments.loyalLowValue.length,
          customers: segments.loyalLowValue.slice(0, 5).map(c => ({
            name: c.name,
            totalOrders: c.totalOrders,
            avgOrderValue: Math.round(c.avgOrderValue * 100) / 100,
            totalSpent: Math.round(c.totalSpent * 100) / 100
          }))
        },
        bigTicket: {
          title: 'Big-Ticket Customers',
          description: 'Low frequency, high value customers',
          icon: '💎',
          color: '#F59E0B',
          action: 'Increase Frequency',
          count: segments.bigTicket.length,
          customers: segments.bigTicket.slice(0, 5).map(c => ({
            name: c.name,
            totalOrders: c.totalOrders,
            avgOrderValue: Math.round(c.avgOrderValue * 100) / 100,
            totalSpent: Math.round(c.totalSpent * 100) / 100
          }))
        },
        lowEngagement: {
          title: 'Low Engagement',
          description: 'Low frequency, low value customers',
          icon: '📉',
          color: '#EF4444',
          action: 'Re-engage',
          count: segments.lowEngagement.length,
          customers: segments.lowEngagement.slice(0, 5).map(c => ({
            name: c.name,
            totalOrders: c.totalOrders,
            avgOrderValue: Math.round(c.avgOrderValue * 100) / 100,
            totalSpent: Math.round(c.totalSpent * 100) / 100
          }))
        }
      },
      segmentDistribution: {
        vipChampions: segments.vipChampions.length,
        loyalLowValue: segments.loyalLowValue.length,
        bigTicket: segments.bigTicket.length,
        lowEngagement: segments.lowEngagement.length
      },
      rfmThresholds: {
        highFrequencyThreshold,
        highAOVThreshold: Math.round(highAOVThreshold * 100) / 100,
        lowFrequencyThreshold,
        lowAOVThreshold: Math.round(lowAOVThreshold * 100) / 100
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Tenants endpoint
app.get('/api/tenants', (req, res) => {
  try {
    const tenants = Object.keys(SHOPIFY_CONFIG).map(id => ({
      id: id,
      name: id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
    res.json(tenants);
  } catch (error) {
    console.error('Tenants error:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Sync endpoint for real Shopify data
app.post('/api/sync/:entity', async (req, res) => {
  try {
    const { entity } = req.params;
    const { tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    let result;
    switch (entity) {
      case 'customers':
        result = await syncCustomers(tenantId);
        break;
      case 'orders':
        result = await syncOrders(tenantId);
        break;
      case 'products':
        result = await syncProducts(tenantId);
        break;
      case 'all':
        const [customersResult, ordersResult, productsResult] = await Promise.all([
          syncCustomers(tenantId),
          syncOrders(tenantId),
          syncProducts(tenantId)
        ]);
        result = {
          success: true,
          customers: customersResult.count,
          orders: ordersResult.count,
          products: productsResult.count
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    res.json({
      success: true,
      message: `Synced ${entity} for tenant ${tenantId}`,
      data: result
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Sync failed: ' + error.message });
  }
});

// Trends endpoint with real data
app.get('/metrics/trends', async (req, res) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Get orders from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: { gte: thirtyDaysAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const trendsData = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!trendsData[date]) {
        trendsData[date] = { revenue: 0, orders: 0 };
      }
      trendsData[date].revenue += order.totalPrice;
      trendsData[date].orders += 1;
    });

    // Convert to arrays
    const revenue = Object.entries(trendsData).map(([date, data]) => ({
      date,
      value: data.revenue
    }));

    const ordersTrend = Object.entries(trendsData).map(([date, data]) => ({
      date,
      value: data.orders
    }));

    res.json({ revenue, orders: ordersTrend });

  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Top customers endpoint with real-time calculated data
app.get('/api/top-customers', async (req, res) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Get customers with their orders for real-time calculation
    const customerMetrics = await prisma.customer.findMany({
      where: { tenantId },
      include: {
        orders: {
          select: {
            totalPrice: true,
            createdAt: true,
            orderNumber: true
          }
        }
      }
    });

    // Calculate real-time metrics for each customer
    const rfmData = customerMetrics.map(customer => {
      const orders = customer.orders;
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

      return {
        customerId: customer.id,
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email || 'Guest Customer',
        email: customer.email || 'No email',
        totalOrders,
        totalSpent,
        avgOrderValue
      };
    });

    // Sort by total spent and take top 10
    const topCustomers = rfmData
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    const response = topCustomers.map(customer => ({
      name: customer.name,
      email: customer.email,
      totalSpent: Math.round(customer.totalSpent * 100) / 100,
      ordersCount: customer.totalOrders,
      avgOrderValue: Math.round(customer.avgOrderValue * 100) / 100
    }));

    res.json(response);

  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({ error: 'Failed to fetch top customers' });
  }
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - in production, use proper authentication
  if (email === 'admin@xeno.com' && password === 'admin123') {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      success: true,
      token,
      user: {
        id: 1,
        email: 'admin@xeno.com',
        name: 'Admin User'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  // Mock user data - in production, verify JWT token
  res.json({
    id: 1,
    email: 'admin@xeno.com',
    name: 'Admin User'
  });
});

// Initialize sample stores in database
async function initializeSampleStores() {
  try {
    console.log('🔄 Initializing sample stores...');
    
    for (const [storeId, config] of Object.entries(SHOPIFY_CONFIG)) {
      await prisma.tenant.upsert({
        where: { id: storeId },
        update: {
          shopifyDomain: config.domain,
          accessToken: config.accessToken,
          apiVersion: config.apiVersion
        },
        create: {
          id: storeId,
          name: storeId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          shopifyDomain: config.domain,
          accessToken: config.accessToken,
          apiVersion: config.apiVersion
        }
      });
    }
    
    console.log('✅ Sample stores initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing stores:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Xeno Dashboard Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics endpoint: http://localhost:${PORT}/api/metrics`);
  console.log(`👥 Tenants endpoint: http://localhost:${PORT}/api/tenants`);
  console.log(`📊 Trends endpoint: http://localhost:${PORT}/metrics/trends`);
  console.log(`🔄 Sync endpoints: http://localhost:${PORT}/api/sync/customers, /api/sync/orders, /api/sync/products, /api/sync/all`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize stores
  await initializeSampleStores();
});

module.exports = app;