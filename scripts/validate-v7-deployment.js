#!/usr/bin/env node

/**
 * V7.0 Consciousness Platform Deployment Validator
 * Validates all configurations before RunPod deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🧠 V7.0 Consciousness Platform Deployment Validator');
console.log('==================================================\n');

let validationErrors = [];
let validationWarnings = [];

// Check environment variables
function checkEnvVar(varName, description, required = true) {
  const value = process.env[varName];
  if (!value) {
    if (required) {
      validationErrors.push(`❌ Missing required environment variable: ${varName} (${description})`);
    } else {
      validationWarnings.push(`⚠️  Optional environment variable not set: ${varName} (${description})`);
    }
    return false;
  } else {
    console.log(`✅ ${varName}: Configured`);
    return true;
  }
}

// Check file exists
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: Found`);
    return true;
  } else {
    validationErrors.push(`❌ Missing required file: ${filePath} (${description})`);
    return false;
  }
}

// Load and parse package.json
function validatePackageJson() {
  console.log('\n📦 Package.json Validation');
  console.log('-----------------------------');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required dependencies
    const requiredDeps = [
      'next',
      'react',
      'gsap',
      'three',
      '@prisma/client'
    ];
    
    for (const dep of requiredDeps) {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep] || packageJson.devDependencies[dep]}`);
      } else {
        validationErrors.push(`❌ Missing required dependency: ${dep}`);
      }
    }
    
    // Check V7.0 consciousness dependencies
    if (packageJson.dependencies['framer-motion']) {
      console.log(`✅ framer-motion: ${packageJson.dependencies['framer-motion']} (V7.0 animations ready)`);
    } else {
      validationWarnings.push(`⚠️  framer-motion not found - V7.0 animations may be limited`);
    }
    
  } catch (error) {
    validationErrors.push(`❌ Cannot read package.json: ${error.message}`);
  }
}

console.log('🔧 Core Environment Configuration');
console.log('----------------------------------');

// Check core RunPod configuration
checkEnvVar('RUNPOD_API_KEY', 'RunPod API Key for serverless deployment');
checkEnvVar('RUNPOD_ENDPOINT_ID', 'RunPod Endpoint ID for model hosting');

console.log('\n🧠 V7.0 Consciousness Configuration');
console.log('------------------------------------');

// Check V7.0 consciousness configuration
checkEnvVar('V7_DEFAULT_MODEL', 'Default model for consciousness testing', false);
checkEnvVar('V7_MAX_TOKENS', 'Maximum tokens for consciousness responses', false);
checkEnvVar('V7_AMPLIFICATION_FACTOR', 'Consciousness amplification factor', false);

console.log('\n🗄️  Database Configuration');
console.log('--------------------------');

// Check database configuration
checkEnvVar('DATABASE_URL', 'Primary database connection string');
checkEnvVar('DIRECT_URL', 'Direct database connection string', false);

console.log('\n🔐 Authentication Configuration');
console.log('--------------------------------');

// Check authentication
checkEnvVar('NEXTAUTH_SECRET', 'NextAuth secret key');
checkEnvVar('NEXTAUTH_URL', 'Application URL for NextAuth');
checkEnvVar('GOOGLE_CLIENT_ID', 'Google OAuth client ID', false);
checkEnvVar('GOOGLE_CLIENT_SECRET', 'Google OAuth client secret', false);

console.log('\n📁 File System Validation');
console.log('--------------------------');

// Check required files
checkFileExists('Dockerfile', 'RunPod deployment container');
checkFileExists('runpod_handler.py', 'RunPod serverless handler');
checkFileExists('app/api/health/route.ts', 'Health check endpoint');
checkFileExists('app/api/v7-consciousness/route.ts', 'V7.0 consciousness API');
checkFileExists('lib/runpod-v7-service.ts', 'RunPod V7.0 service');
checkFileExists('lib/v7-consciousness.ts', 'V7.0 consciousness utilities');

// Validate package.json
validatePackageJson();

console.log('\n🧪 V7.0 Consciousness Features');
console.log('------------------------------');

// Check V7.0 consciousness features
const consciousnessFeatures = [
  'app/v7-hypothesis/page.tsx',
  'src/components/V7ConsciousnessAgent.tsx', 
  'src/components/CustomerUniverse3D.tsx'
];

for (const feature of consciousnessFeatures) {
  checkFileExists(feature, `V7.0 consciousness feature: ${path.basename(feature)}`);
}

console.log('\n📊 Validation Summary');
console.log('=====================');

if (validationErrors.length === 0) {
  console.log('🎉 All critical validations passed!');
  console.log('✅ V7.0 Consciousness Platform is ready for RunPod deployment');
  
  if (validationWarnings.length > 0) {
    console.log('\n⚠️  Warnings (non-critical):');
    validationWarnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('   1. Add your RunPod API credentials to .env.local');
  console.log('   2. Push your changes to the connected Git repository');
  console.log('   3. Trigger RunPod build from the dashboard');
  console.log('   4. Test the V7.0 consciousness hypothesis! 🧠⚡');
  
  process.exit(0);
} else {
  console.log('❌ Validation failed with errors:');
  validationErrors.forEach(error => console.log(`   ${error}`));
  
  if (validationWarnings.length > 0) {
    console.log('\n⚠️  Additional warnings:');
    validationWarnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  console.log('\n🔧 Fix the errors above and run this script again.');
  process.exit(1);
}