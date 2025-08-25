// 🚀 PH Trading Seeding Script Runner
// Simple Node.js runner for the TypeScript seeding script

const { exec } = require('child_process');
const path = require('path');

console.log('🌟 PH Trading Customer Intelligence Seeder');
console.log('Preparing to seed database with Julius-validated customer data...\n');

// Run simple JavaScript version (no TypeScript issues)
const scriptPath = path.join(__dirname, 'seed-simple.js');
const command = `node "${scriptPath}"`;

console.log('🔧 Compiling and running seeding script...');

const seedProcess = exec(command, { cwd: process.cwd() });

seedProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

seedProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('Your PH Trading ERP is now demo-ready with realistic customer data! 🚀');
  } else {
    console.log(`\n❌ Seeding process exited with code ${code}`);
    console.log('Check the error messages above for troubleshooting.');
  }
});

seedProcess.on('error', (error) => {
  console.error(`❌ Failed to start seeding process: ${error.message}`);
  console.log('Make sure TypeScript and ts-node are installed:');
  console.log('  npm install -g typescript ts-node');
});