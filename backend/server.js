/**
 * Entry Script
 */
require('@babel/register');
require('@babel/polyfill');
require('dotenv').config();

// Validate environment variables before starting server
const { validateEnvironment } = require('./server/util/envValidator');
validateEnvironment();

require('./server/server');
