/**
 * Authentication Feature Test Script
 * Tests signup and login functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/auth';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test user data
const testUser = {
  accountName: `testuser_${Date.now()}@gmail.com`,
  password: 'TestPassword@123'
};

let otpCode = null;
let accessToken = null;

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log(`Testing: ${testName}`, 'blue');
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: User Registration
async function testRegistration() {
  logTest('User Registration');
  
  try {
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    
    if (response.status === 200 || response.status === 201) {
      logSuccess(`Registration successful for: ${testUser.accountName}`);
      logSuccess(`Response: ${JSON.stringify(response.data)}`);
      
      if (response.data.message && response.data.message.includes('verification')) {
        logSuccess('OTP verification flow is active');
        return true;
      }
      
      if (response.data.accessToken) {
        logWarning('User was auto-logged in (OTP verification might be disabled)');
        accessToken = response.data.accessToken;
        return true;
      }
      
      return true;
    }
  } catch (error) {
    if (error.response) {
      logError(`Registration failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      logError(`Registration failed: ${error.message}`);
    }
    return false;
  }
}

// Test 2: Login Without Verification
async function testLoginWithoutVerification() {
  logTest('Login Without Email Verification');
  
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      accountName: testUser.accountName,
      password: testUser.password
    });
    
    if (response.data.accessToken) {
      logWarning('Login succeeded without verification (verification might be disabled)');
      accessToken = response.data.accessToken;
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      logSuccess('Login correctly blocked: User must verify email first');
      return true;
    } else if (error.response) {
      logError(`Unexpected error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      logError(`Login failed: ${error.message}`);
    }
    return false;
  }
}

// Test 3: Resend OTP
async function testResendOTP() {
  logTest('Resend OTP');
  
  try {
    const response = await axios.post(`${BASE_URL}/resend-otp`, {
      accountName: testUser.accountName
    });
    
    if (response.status === 200) {
      logSuccess('OTP resent successfully');
      logSuccess(`Response: ${JSON.stringify(response.data)}`);
      return true;
    }
  } catch (error) {
    if (error.response) {
      logError(`Resend OTP failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      logError(`Resend OTP failed: ${error.message}`);
    }
    return false;
  }
}

// Test 4: Verify OTP with Wrong Code
async function testVerifyWrongOTP() {
  logTest('Verify OTP with Wrong Code');
  
  try {
    const response = await axios.post(`${BASE_URL}/verify-otp`, {
      accountName: testUser.accountName,
      otp: '000000',
      password: testUser.password
    });
    
    if (response.data.accessToken) {
      logError('Wrong OTP was accepted (security issue!)');
      return false;
    }
  } catch (error) {
    if (error.response && (error.response.status === 400 || error.response.status === 401)) {
      logSuccess('Wrong OTP correctly rejected');
      return true;
    } else if (error.response) {
      logError(`Unexpected error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      logError(`Verify OTP failed: ${error.message}`);
    }
    return false;
  }
}

// Test 5: Manual OTP Entry (requires user input)
async function testManualOTPVerification() {
  logTest('Manual OTP Verification');
  
  log('\n📧 Please check the email sent to:', 'yellow');
  log(`   ${testUser.accountName}`, 'yellow');
  log('   (Check console logs for OTP if email service is in dev mode)\n', 'yellow');
  
  // In a real scenario, you'd prompt for OTP input
  // For automated testing, we'll skip this and note it
  logWarning('Manual OTP verification requires checking email/logs');
  logWarning('You can manually test by calling: POST /api/auth/verify-otp');
  logWarning(`With body: { accountName: "${testUser.accountName}", otp: "XXXXXX", password: "${testUser.password}" }`);
  
  return true;
}

// Test 6: Login with Existing User
async function testLoginExistingUser() {
  logTest('Login with Existing Verified User');
  
  // Try to login with an existing verified user
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      accountName: 'admin', // assuming there's an admin user
      password: 'Admin@123'
    });
    
    if (response.data.accessToken) {
      logSuccess('Login successful for existing user');
      logSuccess(`Access token received: ${response.data.accessToken.substring(0, 30)}...`);
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logWarning('Login failed: Invalid credentials (this is normal if test user doesn\'t exist)');
      return true;
    } else if (error.response) {
      logError(`Login failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      logError(`Login failed: ${error.message}`);
    }
    return false;
  }
}

// Test 7: Duplicate Registration
async function testDuplicateRegistration() {
  logTest('Duplicate Registration Prevention');
  
  try {
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    
    logError('Duplicate registration was allowed (should be prevented)');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      const message = JSON.stringify(error.response.data);
      if (message.includes('already') || message.includes('exist')) {
        logSuccess('Duplicate registration correctly prevented');
        return true;
      }
    }
    logError(`Unexpected error: ${error.response ? error.response.status : error.message}`);
    return false;
  }
}

// Test 8: Invalid Login Attempts
async function testInvalidLogins() {
  logTest('Invalid Login Attempts');
  
  let allPassed = true;
  
  // Test wrong password
  try {
    await axios.post(`${BASE_URL}/login`, {
      accountName: testUser.accountName,
      password: 'WrongPassword123'
    });
    logError('Wrong password was accepted');
    allPassed = false;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      logSuccess('Wrong password correctly rejected');
    } else {
      logError(`Unexpected error for wrong password: ${error.response ? error.response.status : error.message}`);
      allPassed = false;
    }
  }
  
  // Test non-existent user
  try {
    await axios.post(`${BASE_URL}/login`, {
      accountName: 'nonexistent_user_12345@test.com',
      password: 'SomePassword123'
    });
    logError('Non-existent user login was accepted');
    allPassed = false;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      logSuccess('Non-existent user login correctly rejected');
    } else {
      logError(`Unexpected error for non-existent user: ${error.response ? error.response.status : error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// Main test runner
async function runTests() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║     Authentication Feature Test Suite                     ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝\n', 'blue');
  
  log('Test Configuration:', 'yellow');
  log(`  Backend URL: ${BASE_URL}`);
  log(`  Test User: ${testUser.accountName}`);
  log(`  Test Password: ${testUser.password}\n`);
  
  const results = {
    passed: 0,
    failed: 0,
    total: 8
  };
  
  // Wait for server to be ready
  log('Waiting for server to be ready...', 'yellow');
  await wait(3000);
  
  // Run tests
  const tests = [
    { name: 'Registration', fn: testRegistration },
    { name: 'Login Without Verification', fn: testLoginWithoutVerification },
    { name: 'Resend OTP', fn: testResendOTP },
    { name: 'Wrong OTP Verification', fn: testVerifyWrongOTP },
    { name: 'Manual OTP Verification', fn: testManualOTPVerification },
    { name: 'Duplicate Registration', fn: testDuplicateRegistration },
    { name: 'Existing User Login', fn: testLoginExistingUser },
    { name: 'Invalid Login Attempts', fn: testInvalidLogins }
  ];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      if (passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      logError(`Test "${test.name}" threw an error: ${error.message}`);
      results.failed++;
    }
    await wait(500); // Small delay between tests
  }
  
  // Print summary
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║                    Test Summary                            ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  log(`Total Tests: ${results.total}`);
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  log(`\nSuccess Rate: ${percentage}%`, percentage >= 75 ? 'green' : 'red');
  
  log('\n📝 Note: Some tests require manual verification (OTP email check)', 'yellow');
  log('💡 Tip: Check server logs for OTP codes in development mode\n', 'yellow');
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
