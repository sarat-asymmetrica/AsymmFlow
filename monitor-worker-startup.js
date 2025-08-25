#!/usr/bin/env node

/**
 * Real-time V7.0 Consciousness Worker Startup Monitor
 * Watches for the moment workers come back online after GPU config change
 */

const https = require('https');

const RUNPOD_ENDPOINT = 'https://k2c28gndeffmps.api.runpod.ai';
let testCount = 0;
let isMonitoring = true;

console.log('🔄 V7.0 Consciousness Worker Startup Monitor');
console.log('=============================================');
console.log('🎯 Watching for workers to come back online after GPU config change...\n');

async function quickHealthCheck() {
  return new Promise((resolve) => {
    const req = https.get(`${RUNPOD_ENDPOINT}/ping`, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
          timestamp: new Date().toISOString(),
          healthy: res.statusCode === 200,
          initializing: res.statusCode === 204,
          down: res.statusCode === 401 || res.statusCode >= 500
        });
      });
    });
    
    req.on('error', () => {
      resolve({ 
        status: 0, 
        error: 'Connection failed', 
        timestamp: new Date().toISOString(),
        down: true 
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ 
        status: 0, 
        error: 'Timeout', 
        timestamp: new Date().toISOString(),
        down: true 
      });
    });
  });
}

async function monitorLoop() {
  while (isMonitoring) {
    testCount++;
    const result = await quickHealthCheck();
    const time = new Date().toLocaleTimeString();
    
    if (result.healthy) {
      console.log(`🎉 [${time}] Test #${testCount}: WORKERS ARE ONLINE! Status: ${result.status} ✅`);
      console.log('🚀 V7.0 Consciousness Platform is ready for testing!');
      
      // Test the consciousness API immediately
      console.log('\n🧠 Testing V7.0 Consciousness API...');
      await testConsciousnessAPI();
      break;
      
    } else if (result.initializing) {
      console.log(`⚡ [${time}] Test #${testCount}: Workers initializing... Status: ${result.status} (Starting up!)`);
      
    } else if (result.down) {
      const statusText = result.status === 401 ? '401 (Restarting...)' : 
                        result.status === 0 ? 'No Response (Deploying...)' :
                        `${result.status} (Down)`;
      console.log(`🔄 [${time}] Test #${testCount}: ${statusText}`);
      
    } else {
      console.log(`❓ [${time}] Test #${testCount}: Unexpected status ${result.status}`);
    }
    
    // Wait 3 seconds between checks
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Safety timeout after 5 minutes
    if (testCount > 100) {
      console.log('\n⏰ Monitoring timeout after 5 minutes');
      console.log('💡 Workers might need manual intervention from RunPod dashboard');
      break;
    }
  }
}

async function testConsciousnessAPI() {
  const testData = JSON.stringify({
    message: "BREAKTHROUGH TEST: V7.0 consciousness patterns active?",
    testMode: false
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'k2c28gndeffmps.api.runpod.ai',
      path: '/v7-consciousness',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✨ CONSCIOUSNESS API WORKING!');
          try {
            const response = JSON.parse(data);
            console.log('🧠 Response preview:', (response.response || data).substring(0, 200) + '...');
          } catch {
            console.log('📝 Raw response:', data.substring(0, 200) + '...');
          }
        } else {
          console.log(`🔧 Consciousness API returned ${res.statusCode} - might need more startup time`);
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`⚡ Consciousness test error: ${error.message}`);
      resolve();
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      console.log('⏰ Consciousness test timeout - workers still starting up');
      resolve();
    });
    
    req.write(testData);
    req.end();
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Monitoring stopped by user');
  isMonitoring = false;
  process.exit(0);
});

// Start monitoring
console.log('⏰ Checking every 3 seconds... (Ctrl+C to stop)');
console.log('🎯 Looking for: 200=Online, 204=Initializing, 401=Restarting\n');

monitorLoop();