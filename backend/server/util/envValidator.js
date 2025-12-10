/**
 * Environment validation utility
 * Validates required environment variables for production
 */

const requiredEnvVars = {
  development: [
    'DB_HOST_WRITE',
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD',
    'USER_JWT_SECRET_KEY',
    'SERVER_PORT',
  ],
  production: [
    'DB_HOST_WRITE',
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD',
    'USER_JWT_SECRET_KEY',
    'USER_JWT_SECRET_KEY_FORGOT_PASSWORD',
    'SERVER_PORT',
    'FRONTEND_HOST',
    'SENDGRID_API_KEY',
    'SENDER_EMAIL',
    'MONGO_URI',
  ]
};

const securityChecks = {
  production: {
    'USER_JWT_SECRET_KEY': (value) => {
      if (value === 'KEY' || value.length < 32) {
        return 'JWT secret must be at least 32 characters and not default value';
      }
      return null;
    },
    'NODE_ENV': (value) => {
      if (value !== 'production') {
        return 'NODE_ENV must be set to "production"';
      }
      return null;
    }
  }
};

export function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const checks = securityChecks[env] || {};
  
  const missing = [];
  const warnings = [];
  const errors = [];

  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Run security checks
  Object.entries(checks).forEach(([varName, checkFn]) => {
    const value = process.env[varName];
    if (value) {
      const error = checkFn(value);
      if (error) {
        errors.push(`${varName}: ${error}`);
      }
    }
  });

  // Additional warnings
  if (env === 'production') {
    if (process.env.SERVER_ORIGIN === '*') {
      warnings.push('SERVER_ORIGIN is set to "*" - should be specific domain(s) in production');
    }
    if (!process.env.FRONTEND_HOST || process.env.FRONTEND_HOST.includes('localhost')) {
      warnings.push('FRONTEND_HOST should be set to production domain');
    }
  }

  // Report results
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(v => console.error(`  - ${v}`));
  }

  if (errors.length > 0) {
    console.error('\n❌ Environment validation errors:');
    errors.forEach(e => console.error(`  - ${e}`));
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment warnings:');
    warnings.forEach(w => console.warn(`  - ${w}`));
  }

  if (missing.length > 0 || errors.length > 0) {
    console.error('\n❌ Environment validation failed. Please check your .env file.\n');
    if (env === 'production') {
      process.exit(1); // Exit in production
    }
  } else {
    console.log(`\n✅ Environment validation passed (${env} mode)\n`);
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
    warnings
  };
}
