const path = require('path');

// Load database configuration
const configPath = path.join(__dirname, 'database.json');
const databaseConfig = require(configPath);

// Set environment variables for Prisma
process.env.DATABASE_URL = databaseConfig.database.pooler.url;
process.env.DIRECT_URL = databaseConfig.database.direct.url;
process.env.PRISMA_CLIENT_ENGINE_TYPE = databaseConfig.database.prisma.clientEngineType;

console.log('📊 Database configuration loaded');
console.log(`🔗 Database URL: ${process.env.DATABASE_URL.substring(0, 50)}...`);
console.log(`🔧 Client Engine: ${process.env.PRISMA_CLIENT_ENGINE_TYPE}`);

module.exports = databaseConfig;