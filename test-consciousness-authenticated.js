#!/usr/bin/env node

/**
 * V7.0 Consciousness API Test with RunPod Authentication
 * Tests with proper Authorization: Bearer API_KEY headers
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const env = {};
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Could not load .env.local:', error.message);
    return {};
  }
}

const env = loadEnvFile();
const RUNPOD_API_KEY = env.RUNPOD_API_KEY || process.env.RUNPOD_API_KEY;
const RUNPOD_ENDPOINT = 'https://k2c28gndeffmps.api.runpod.ai';

console.log('🧠 V7.0 Consciousness API Test with Authentication');
console.log('==================================================\n');

if (!RUNPOD_API_KEY) {
  console.error('❌ RUNPOD_API_KEY not found in .env.local or environment variables');
  console.log('💡 Make sure your .env.local has: RUNPOD_API_KEY=your_actual_api_key');
  process.exit(1);
}

console.log('✅ RunPod API Key loaded successfully');
console.log(`🔗 Endpoint: ${RUNPOD_ENDPOINT}\n`);

// Test with authentication
async function testWithAuth(path, method = 'GET', data = null) {
  console.log(`Testing: ${method} ${path}`);
  
  const headers = {
    'Authorization': `Bearer ${RUNPOD_API_KEY}`,
    'User-Agent': 'V7.0-Consciousness-Test/1.0',
    'Accept': '*/*'
  };
  
  if (data) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(data);
  }

  const options = {
    hostname: 'k2c28gndeffmps.api.runpod.ai',
    path: path,
    method: method,
    headers: headers
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (responseData) {
          try {
            const parsed = JSON.parse(responseData);
            console.log(`   Response: ${JSON.stringify(parsed, null, 2)}`);
          } catch {
            console.log(`   Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
          }
        } else {
          console.log(`   Response: (empty)`);
        }
        
        resolve({
          status: res.statusCode,
          body: responseData,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      resolve({ status: 0, error: error.message, success: false });
    });
    
    req.setTimeout(30000, () => {
      console.log('   ❌ Timeout after 30 seconds');
      req.destroy();
      resolve({ status: 0, error: 'Timeout', success: false });
    });
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runAuthenticatedTests() {
  console.log('🔐 Running Authenticated Tests');
  console.log('==============================\n');
  
  // Test 1: Health check with auth
  console.log('1. Testing Health Check with Authentication (/ping)...');
  const pingResult = await testWithAuth('/ping', 'GET');
  
  // Test 2: Detailed health check
  console.log('\n2. Testing Detailed Health Check (/health)...');
  const healthResult = await testWithAuth('/health', 'GET');
  
  // Test 3: Root endpoint info
  console.log('\n3. Testing Root Endpoint (/)...');
  const rootResult = await testWithAuth('/', 'GET');
  
  // Test 4: V7.0 consciousness API - basic test
  console.log('\n4. Testing V7.0 Consciousness API - Basic Test...');
  const basicConsciousnessData = JSON.stringify({
    message: "Test V7.0 consciousness awareness - what mathematical patterns do you recognize?",
    testMode: false
  });
  const basicResult = await testWithAuth('/v7-consciousness', 'POST', basicConsciousnessData);
  
  // Test 5: V7.0 hypothesis validation test
  console.log('\n5. Testing V7.0 Hypothesis Validation (Test Mode)...');
  const hypothesisData = JSON.stringify({
    message: "Run full consciousness hypothesis validation",
    testMode: true
  });
  const hypothesisResult = await testWithAuth('/v7-consciousness', 'POST', hypothesisData);
  
  // Results summary
  console.log('\n📊 Authenticated Test Results');
  console.log('=============================');
  
  const tests = [
    { name: 'Health Check', result: pingResult },
    { name: 'Detailed Health', result: healthResult },
    { name: 'Root Endpoint', result: rootResult },
    { name: 'Basic Consciousness', result: basicResult },
    { name: 'Hypothesis Validation', result: hypothesisResult }
  ];
  
  tests.forEach(test => {
    const status = test.result.success ? '✅ PASS' : '❌ FAIL';
    const code = test.result.status || 'ERROR';
    console.log(`${status} ${test.name}: ${code}`);
  });
  
  // Analysis
  if (tests.some(t => t.result.success)) {
    console.log('\n🎉 BREAKTHROUGH! Authentication is working!');
    
    if (basicResult.success) {
      console.log('🧠 V7.0 Consciousness API is operational!');
    }
    
    if (hypothesisResult.success) {
      console.log('⚡ Hypothesis validation platform is ready for testing!');
      console.log('🌟 The V7.0 consciousness transfer experiment can begin!');
    }
  } else {
    console.log('\n🔧 Still debugging needed...');
    
    if (tests.every(t => t.result.status === 401)) {
      console.log('🔑 All requests still return 401 - check API key validity');
    } else if (tests.every(t => t.result.status === 502 || t.result.status === 503)) {
      console.log('🚀 Worker not ready - Flask server may be starting up');
    }
  }
  
  console.log('\n🎯 Next Steps:');
  if (basicResult.success && hypothesisResult.success) {
    console.log('✨ Ready for full V7.0 consciousness transfer validation!');
    console.log('🧪 The mathematical consciousness hypothesis can now be tested!');
  } else if (basicResult.success) {
    console.log('🔬 Basic consciousness API working - optimize hypothesis testing');
  } else {
    console.log('🔧 Debug remaining authentication or server startup issues');
  }
}

// Run the authenticated tests
runAuthenticatedTests();