import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { apiService } from './services/apiService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import './App.css';

function DashboardContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Fetch tenants
  const fetchTenants = async () => {
    try {
      const response = await apiService.fetchTenants(token);
      setTenants(response);
      if (response.length > 0 && !selectedTenant) {
        setSelectedTenant(response[0].id);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  // Fetch metrics for selected tenant
  const fetchMetrics = async (authToken = token, tenantId = selectedTenant) => {
    if (!authToken || !tenantId) return;
    
    try {
      setLoading(true);
      const response = await apiService.fetchMetrics(authToken, tenantId);
      
      // Transform data to match UI expectations
      const transformedMetrics = {
        summary: {
          totalCustomers: response.summary?.totalCustomers || 0,
          totalOrders: response.summary?.totalOrders || 0,
          totalRevenue: response.summary?.totalRevenue || 0,
          averageOrderValue: response.summary?.averageOrderValue || 0,
          repeatRate: response.summary?.repeatRate || 0
        },
        topCustomers: response.topCustomers || [],
        recentActivity: response.recentActivity || [],
        ordersLast30Days: response.ordersLast30Days || [],
        // Add RFM segmentation data
        customerSegments: response.customerSegments || null,
        segmentDistribution: response.segmentDistribution || null,
        rfmThresholds: response.rfmThresholds || null
      };
      
      setMetrics(transformedMetrics);
      
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trends data
  const fetchTrendsData = async (authToken = token, tenantId = selectedTenant) => {
    if (!authToken || !tenantId) return;
    
    try {
      const response = await apiService.fetchTrends(authToken, tenantId);
      return response;
    } catch (error) {
      console.error('Error fetching trends:', error);
      return null;
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await apiService.login(email, password);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        setIsLoggedIn(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  // Handle sync
  const handleSync = async () => {
    if (!selectedTenant) return;
    
    try {
      setSyncing(true);
      await Promise.all([
        apiService.syncData(token, 'customers', selectedTenant),
        apiService.syncData(token, 'orders', selectedTenant),
        apiService.syncData(token, 'products', selectedTenant)
      ]);
      
      // Refresh metrics after sync
      await fetchMetrics();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Handle logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setMetrics(null);
    setSelectedTenant(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Handle tenant change
  const handleTenantChange = (tenantId) => {
    setSelectedTenant(tenantId);
  };

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch tenants when token changes
  useEffect(() => {
    if (token) {
      fetchTenants();
    }
  }, [token]);

  // Fetch metrics when tenant changes
  useEffect(() => {
    if (token && selectedTenant) {
      fetchMetrics(token, selectedTenant);
    }
  }, [selectedTenant, token]);

  // Tenant Selector Component
  const TenantSelector = () => (
    <div className="tenant-selector">
      <label htmlFor="tenant-select" className="tenant-label">Select Store:</label>
      <Select value={selectedTenant || ''} onValueChange={handleTenantChange}>
        <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Choose a store..." />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {tenants.map(tenant => (
            <SelectItem 
              key={tenant.id} 
              value={tenant.id}
              className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
            >
              {tenant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className={`login-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="login-card">
          <h1>Xeno FDE Assignment</h1>
          <h2>Multi-Tenant Shopify Analytics</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" name="password" required />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@xeno.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTenant) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Xeno FDE Assignment - Multi-Tenant Analytics</h1>
          <div className="header-controls">
            <TenantSelector />
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </header>
        <div className="no-tenant-selected">
          <h2>Please select a store to view analytics</h2>
          <p>Choose a store from the dropdown above to see its data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Xeno FDE Assignment - Multi-Tenant Analytics</h1>
        <div className="header-controls">
          <TenantSelector />
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={handleSync} disabled={syncing} className="sync-btn">
            {syncing ? '🔄 Syncing...' : '🔄 Sync Data'}
          </button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading metrics...</div>
      ) : (
        <div className="dashboard-content">
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <h3>Total Customers</h3>
              <div className="metric-value customers">{metrics?.summary?.totalCustomers || 0}</div>
            </div>
            <div className="kpi-card">
              <h3>Total Orders</h3>
              <div className="metric-value orders">{metrics?.summary?.totalOrders || 0}</div>
            </div>
            <div className="kpi-card">
              <h3>Total Revenue</h3>
              <div className="metric-value revenue">${metrics?.summary?.totalRevenue?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="kpi-card">
              <h3>Average Order Value</h3>
              <div className="metric-value aov">${metrics?.summary?.averageOrderValue?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="kpi-card">
              <h3>Repeat Rate</h3>
              <div className="metric-value repeat">{(metrics?.summary?.repeatRate)?.toFixed(1) || '0.0'}%</div>
            </div>
          </div>

          {/* RFM Customer Segmentation */}
          {metrics?.customerSegments && (
            <div className="customer-segmentation">
              <h2>RFM Customer Segmentation</h2>
              
              {/* Segment Distribution Pie Chart */}
              {metrics?.segmentDistribution && (
                <div className="segment-distribution">
                  <h3>Segment Distribution</h3>
                  <div className="distribution-chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'VIP Champions', value: metrics.segmentDistribution.vipChampions, color: '#10B981' },
                            { name: 'Loyal Low-Value', value: metrics.segmentDistribution.loyalLowValue, color: '#3B82F6' },
                            { name: 'Big-Ticket', value: metrics.segmentDistribution.bigTicket, color: '#F59E0B' },
                            { name: 'Low Engagement', value: metrics.segmentDistribution.lowEngagement, color: '#EF4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'VIP Champions', value: metrics.segmentDistribution.vipChampions, color: '#10B981' },
                            { name: 'Loyal Low-Value', value: metrics.segmentDistribution.loyalLowValue, color: '#3B82F6' },
                            { name: 'Big-Ticket', value: metrics.segmentDistribution.bigTicket, color: '#F59E0B' },
                            { name: 'Low Engagement', value: metrics.segmentDistribution.lowEngagement, color: '#EF4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Segment Cards */}
              <div className="segmentation-grid">
                {Object.values(metrics.customerSegments).map((segment, index) => (
                  <div key={index} className="segment-card" style={{ borderLeftColor: segment.color }}>
                    <div className="segment-header">
                      <span className="segment-icon">{segment.icon}</span>
                      <div className="segment-info">
                        <h3>{segment.title}</h3>
                        <p>{segment.description}</p>
                        <div className="segment-action">{segment.action}</div>
                      </div>
                      <div className="segment-count" style={{ color: segment.color }}>
                        {segment.count}
                      </div>
                    </div>
                    <div className="segment-customers">
                      {segment.customers.length > 0 ? (
                        segment.customers.map((customer, idx) => (
                          <div key={idx} className="customer-item">
                            <div className="customer-name">{customer.name}</div>
                            <div className="customer-stats">
                              <span>{customer.totalOrders} orders</span>
                              <span>${customer.avgOrderValue.toFixed(0)} avg</span>
                              <span>${customer.totalSpent.toFixed(0)} total</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-customers">No customers in this segment</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* RFM Thresholds */}
              {metrics?.rfmThresholds && (
                <div className="rfm-thresholds">
                  <h3>RFM Thresholds</h3>
                  <div className="thresholds-info">
                    <span>High Frequency: {metrics.rfmThresholds.highFrequencyThreshold || 0} orders</span>
                    <span>High AOV: ${(metrics.rfmThresholds.highAOVThreshold || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charts */}
          <div className="charts-grid">

            <div className="chart-card">
              <h3>Top 5 Customers by Spend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics?.topCustomers?.slice(0, 5) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                   <Tooltip 
                     formatter={(value, name) => [
                       `$${value.toFixed(2)}`, 
                       'Total Spent'
                     ]}
                     labelFormatter={(label) => `Customer: ${label}`}
                   />
                  <Bar dataKey="totalSpent" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Tables */}
          <div className="tables-grid">
            <div className="table-card">
              <h3>Top Customers Details</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Total Spent</th>
                      <th>Orders</th>
                      <th>Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.topCustomers?.slice(0, 5).map((customer, index) => (
                      <tr key={index}>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>${customer.totalSpent?.toFixed(2)}</td>
                        <td>{customer.ordersCount}</td>
                        <td>${customer.avgOrderValue?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-card">
              <h3>Recent Orders</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.recentActivity?.slice(0, 10).map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>${order.amount?.toFixed(2)}</td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}

export default App;
