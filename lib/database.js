const fs = require('fs');
const path = require('path');

// Load database configuration from JSON
const configPath = path.join(__dirname, '..', 'config', 'database.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Export database URLs for use in application
module.exports = {
  DATABASE_URL: config.database.pooler.url,
  DIRECT_URL: config.database.direct.url,
  PRISMA_CLIENT_ENGINE_TYPE: config.database.prisma.clientEngineType,
  
  // Helper functions
  getPoolerUrl: () => config.database.pooler.url,
  getDirectUrl: () => config.database.direct.url,
  getConfig: () => config.database
};

// Set environment variables for Prisma
process.env.DATABASE_URL = config.database.pooler.url;
process.env.DIRECT_URL = config.database.direct.url;
process.env.PRISMA_CLIENT_ENGINE_TYPE = config.database.prisma.clientEngineType;
