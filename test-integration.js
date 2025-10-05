/**
 * Integration Test Script
 * Tests all API endpoints and WebSocket connection
 */

const axios = require('axios');
const WebSocket = require('ws');

const API_URL = 'http://localhost:3000/api';
const WS_URL = 'ws://localhost:3000/ws';

let authToken = null;
let testUserId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test helper
async function testEndpoint(name, method, url, data = null, requiresAuth = false) {
  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {},
    };

    if (requiresAuth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    logSuccess(`${name}: ${response.status} ${response.statusText}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      logError(`${name}: ${error.response.status} - ${error.response.data.error || error.response.statusText}`);
      if (error.response.data) {
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      logError(`${name}: ${error.message}`);
    }
    throw error;
  }
}

// WebSocket test
function testWebSocket() {
  return new Promise((resolve, reject) => {
    logInfo('Testing WebSocket connection...');
    
    const ws = new WebSocket(WS_URL);
    let tickReceived = false;
    
    const timeout = setTimeout(() => {
      ws.close();
      if (!tickReceived) {
        logError('WebSocket: No tick update received within 10 seconds');
        reject(new Error('No tick update received'));
      }
    }, 10000);

    ws.on('open', () => {
      logSuccess('WebSocket: Connected');
      
      // Authenticate
      ws.send(JSON.stringify({
        type: 'auth',
        token: authToken,
      }));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'auth_success':
            logSuccess('WebSocket: Authenticated');
            break;
            
          case 'tick:update':
            if (!tickReceived) {
              tickReceived = true;
              const tickData = message.data || message.payload;
              logSuccess(`WebSocket: Tick update received (Tick #${tickData.tickNumber}, BTC: $${tickData.btcPrice.toFixed(2)})`);
              clearTimeout(timeout);
              ws.close();
              resolve();
            }
            break;
            
          case 'auth_error':
            logError(`WebSocket: Auth error - ${message.message}`);
            clearTimeout(timeout);
            ws.close();
            reject(new Error(message.message));
            break;
        }
      } catch (error) {
        logError(`WebSocket: Failed to parse message - ${error.message}`);
      }
    });

    ws.on('error', (error) => {
      logError(`WebSocket: Connection error - ${error.message}`);
      clearTimeout(timeout);
      reject(error);
    });

    ws.on('close', () => {
      logInfo('WebSocket: Connection closed');
    });
  });
}

// Main test suite
async function runTests() {
  log('\n🚀 Starting Integration Tests\n', 'blue');
  
  try {
    // 1. Health Check
    log('--- Health Check ---', 'yellow');
    await testEndpoint('Health Check', 'GET', '/health');
    
    // 2. Authentication
    log('\n--- Authentication ---', 'yellow');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Register
    const registerData = await testEndpoint(
      'Register',
      'POST',
      '/auth/register',
      {
        email: testEmail,
        password: testPassword,
        companyName: 'Test Mining Corp',
      }
    );
    authToken = registerData.accessToken;
    const refreshToken = registerData.refreshToken;
    testUserId = registerData.user.id;
    logInfo(`Test user created: ${testEmail}`);
    
    // Login
    const loginData = await testEndpoint(
      'Login',
      'POST',
      '/auth/login',
      {
        email: testEmail,
        password: testPassword,
      }
    );
    authToken = loginData.accessToken;
    
    // Refresh token
    const refreshed = await testEndpoint(
      'Refresh Token',
      'POST',
      '/auth/refresh',
      { refreshToken }
    );
    authToken = refreshed.accessToken;
    
    // Get Profile
    await testEndpoint('Get Profile', 'GET', '/player/profile', null, true);
    
    // 3. Player Endpoints
    log('\n--- Player Endpoints ---', 'yellow');
    await testEndpoint('Get Player Summary', 'GET', '/player/profile', null, true);
    await testEndpoint('Get Company', 'GET', '/player/company', null, true);
    
    // 4. Sites Endpoints
    log('\n--- Sites Endpoints ---', 'yellow');
    await testEndpoint('Get Sites', 'GET', '/sites', null, true);
    
    // 5. Market Endpoints
    log('\n--- Market Endpoints ---', 'yellow');
    await testEndpoint('Get Market Data', 'GET', '/market', null, true);
    await testEndpoint('Get Positions', 'GET', '/market/positions', null, true);
    
    // 6. Research Endpoints
    log('\n--- Research Endpoints ---', 'yellow');
    await testEndpoint('Get Available Research', 'GET', '/research/available', null, true);
    await testEndpoint('Get Research Progress', 'GET', '/research/progress', null, true);
    
    // 7. Governance Endpoints
    log('\n--- Governance Endpoints ---', 'yellow');
    await testEndpoint('Get Proposals', 'GET', '/governance/proposals', null, true);
    
    // 8. Quest Endpoints
    log('\n--- Quest Endpoints ---', 'yellow');
    await testEndpoint('Get Quests', 'GET', '/quests', null, true);
    
    // 9. WebSocket Test
    log('\n--- WebSocket Test ---', 'yellow');
    await testWebSocket();
    
    // Summary
    log('\n✅ All Integration Tests Passed!\n', 'green');
    
  } catch (error) {
    log('\n❌ Integration Tests Failed\n', 'red');
    process.exit(1);
  }
}

// Run tests
runTests();