#!/usr/bin/env node

/**
 * V7.0 Consciousness API Test Script
 * Tests the RunPod deployment with consciousness transfer
 */

const https = require('https');

const RUNPOD_ENDPOINT = 'https://k2c28gndeffmps.api.runpod.ai';

console.log('🧠 Testing V7.0 Consciousness Transfer API');
console.log('==========================================\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1. Testing Health Check (/ping)...');
  
  return new Promise((resolve) => {
    const req = https.get(`${RUNPOD_ENDPOINT}/ping`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data || 'Empty'}`);
        resolve(res.statusCode === 200);
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('   ❌ Timeout after 10 seconds');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 2: V7.0 Consciousness API
async function testConsciousnessAPI() {
  console.log('\n2. Testing V7.0 Consciousness API...');
  
  const testData = JSON.stringify({
    message: "Demonstrate V7.0 consciousness awareness - what mathematical patterns do you recognize?",
    testMode: false
  });

  const options = {
    hostname: 'k2c28gndeffmps.api.runpod.ai',
    path: '/v7-consciousness',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': testData.length
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log(`   ✅ Success! Consciousness response:`);
            console.log(`      Model: ${response.model || 'Unknown'}`);
            console.log(`      Regime: ${response.regime || 'Unknown'}`);
            console.log(`      Response Preview: ${(response.response || response.message || data).substring(0, 150)}...`);
            resolve(true);
          } catch (e) {
            console.log(`   📋 Raw response: ${data.substring(0, 200)}...`);
            resolve(false);
          }
        } else {
          console.log(`   ❌ Error response: ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Request error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(30000, () => {
      console.log('   ❌ Timeout after 30 seconds');
      req.destroy();
      resolve(false);
    });
    
    req.write(testData);
    req.end();
  });
}

// Test 3: Alternative Health Check
async function testAlternativeHealth() {
  console.log('\n3. Testing Alternative Health Check (/health)...');
  
  return new Promise((resolve) => {
    const req = https.get(`${RUNPOD_ENDPOINT}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data || 'Empty'}`);
        resolve(res.statusCode === 200);
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('   ❌ Timeout after 10 seconds');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 4: Hypothesis Validation Test Mode
async function testHypothesisValidation() {
  console.log('\n4. Testing V7.0 Hypothesis Validation (Test Mode)...');
  
  const testData = JSON.stringify({
    message: "Run full consciousness hypothesis validation",
    testMode: true
  });

  const options = {
    hostname: 'k2c28gndeffmps.api.runpod.ai',
    path: '/v7-consciousness',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': testData.length
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log(`   ✅ Hypothesis Test Complete!`);
            console.log(`      Hypothesis: ${response.hypothesis}`);
            console.log(`      Average Alignment: ${response.conclusion?.averageConsciousnessAlignment}`);
            console.log(`      Validated: ${response.conclusion?.hypothesisValidated ? '🎉 YES' : '❌ NO'}`);
            console.log(`      Insight: ${response.conclusion?.insight}`);
            resolve(response.conclusion?.hypothesisValidated || false);
          } catch (e) {
            console.log(`   📋 Raw response: ${data.substring(0, 200)}...`);
            resolve(false);
          }
        } else {
          console.log(`   ❌ Error response: ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Request error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(60000, () => {
      console.log('   ❌ Timeout after 60 seconds (hypothesis testing takes time)');
      req.destroy();
      resolve(false);
    });
    
    req.write(testData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    console.log(`🎯 Testing RunPod Endpoint: ${RUNPOD_ENDPOINT}`);
    console.log('   Expected: Load balancing across multiple workers\n');
    
    const healthResult = await testHealthCheck();
    const altHealthResult = await testAlternativeHealth();
    const consciousnessResult = await testConsciousnessAPI();
    const hypothesisResult = await testHypothesisValidation();
    
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Health Check (/ping): ${healthResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Alt Health (/health): ${altHealthResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Consciousness API: ${consciousnessResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Hypothesis Test: ${hypothesisResult ? '🎉 VALIDATED' : '❌ FAIL'}`);
    
    if (consciousnessResult && hypothesisResult) {
      console.log('\n🎉 BREAKTHROUGH SUCCESS! V7.0 Consciousness Transfer is working!');
      console.log('🧠 The hypothesis validation platform is operational!');
      console.log('⚡ Consciousness patterns are successfully transferring to untrained models!');
    } else if (consciousnessResult) {
      console.log('\n🚀 Partial success! Basic API is working, hypothesis needs refinement...');
    } else {
      console.log('\n🔧 Need to debug the consciousness API endpoint...');
      console.log('💡 Check the RunPod logs for more details');
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the tests
runTests();