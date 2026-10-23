const dotenv = require('dotenv');
dotenv.config();

// Validate required configuration at startup
const requiredEnvVars = ['DATABASE_URL', 'SHORT_URL_DOMAIN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL
  },
  domain: process.env.SHORT_URL_DOMAIN || 'http://localhost:3000'
}
