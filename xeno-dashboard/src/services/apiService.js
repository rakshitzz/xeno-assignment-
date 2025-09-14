// API service for fetching dashboard data
const REACT_APP_API_URL = process.env.REACT_APP_REACT_APP_API_URL || 'http://localhost:4000';

export const apiService = {
  async login(email, password) {
    const response = await fetch(`${REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return await response.json();
  },

  async fetchMetrics(token, tenantId) {
    const response = await fetch(`${REACT_APP_API_URL}/api/metrics?tenantId=${tenantId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    
    return await response.json();
  },

  async fetchTenants(token) {
    const response = await fetch(`${REACT_APP_API_URL}/api/tenants`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tenants');
    }
    
    return await response.json();
  },

  async syncData(token, entity, tenantId) {
    const response = await fetch(`${REACT_APP_API_URL}/api/sync/${entity}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tenantId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync ${entity}`);
    }
    
    return await response.json();
  },

  async fetchTrends(token, tenantId) {
    const response = await fetch(`${REACT_APP_API_URL}/metrics/trends?tenantId=${tenantId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch trends');
    }
    
    return await response.json();
  },

  async fetchTopCustomers(token, tenantId) {
    const response = await fetch(`${REACT_APP_API_URL}/api/top-customers?tenantId=${tenantId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch top customers');
    }
    
    return await response.json();
  }
};
