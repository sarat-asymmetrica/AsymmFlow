// 🎯 Demo Data Creator for PH Trading
// Creates JSON files with realistic customer and business data
// No database required - works immediately!

const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// PH Trading customers with V6.0 Julius-validated intelligence
const customers = [
  // A-Grade Customers (Premium Industrial - 33.85% target)
  { id: 'ec35', name: 'BAPCO UPSTREAM W.L.L', type: 'End Customer', code: 'EC35', industry: 'petrochemical', grade: 'A', creditLimit: 150000, paymentDays: 30 },
  { id: 'ec52', name: 'GPIC', type: 'End Customer', code: 'EC52', industry: 'petrochemical', grade: 'A', creditLimit: 180000, paymentDays: 28 },
  { id: 'ec14', name: 'ALUMINIUM BAHRAIN B.S.C.(C)', type: 'End Customer', code: 'EC14', industry: 'manufacturing', grade: 'A', creditLimit: 200000, paymentDays: 35 },
  { id: 'ec25', name: 'Bahrain LNG W.L.L', type: 'End Customer', code: 'EC25', industry: 'petrochemical', grade: 'A', creditLimit: 250000, paymentDays: 32 },
  { id: 'ec33', name: 'BANAGAS', type: 'End Customer', code: 'EC33', industry: 'petrochemical', grade: 'A', creditLimit: 175000, paymentDays: 29 },
  { id: 'ec48', name: 'EWA', type: 'End Customer', code: 'EC48', industry: 'utilities', grade: 'A', creditLimit: 160000, paymentDays: 40 },
  { id: 'ec60', name: 'Hidd Power Co. BSC', type: 'End Customer', code: 'EC60', industry: 'power', grade: 'A', creditLimit: 140000, paymentDays: 35 },
  { id: 'ep10', name: 'HYUNDAI Heavy Industries Co. Ltd.', type: 'Engineering Company, EPC/Licensor', code: 'EP10', industry: 'engineering', grade: 'A', creditLimit: 300000, paymentDays: 45 },

  // B-Grade Customers (Good Business Partners - 28.72% target)
  { id: 'co1', name: 'L&T TECHNOLOGY SERVICES', type: 'Consultant', code: 'CO1', industry: 'engineering', grade: 'B', creditLimit: 75000, paymentDays: 35 },
  { id: 'co2', name: 'Mott MacDonald', type: 'Consultant', code: 'CO2', industry: 'engineering', grade: 'B', creditLimit: 80000, paymentDays: 42 },
  { id: 'ep29', name: 'Shapoorji Pallonji Mideast LLC', type: 'Engineering Company, EPC/Licensor', code: 'EP29', industry: 'engineering', grade: 'B', creditLimit: 120000, paymentDays: 38 },
  { id: 'ep21', name: 'Nass Corporation', type: 'Engineering Company, EPC/Licensor', code: 'EP21', industry: 'engineering', grade: 'B', creditLimit: 90000, paymentDays: 40 },
  { id: 'ec19', name: 'Arab. Gulf Cement Co.', type: 'End Customer', code: 'EC19', industry: 'manufacturing', grade: 'B', creditLimit: 85000, paymentDays: 45 },
  { id: 'ec22', name: 'Arla Foods Bahrain S.P.C', type: 'End Customer', code: 'EC22', industry: 'food', grade: 'B', creditLimit: 65000, paymentDays: 38 },
  { id: 'ec96', name: 'The CocaCola Bottling Company', type: 'End Customer', code: 'EC96', industry: 'food', grade: 'B', creditLimit: 95000, paymentDays: 35 },

  // C-Grade Customers (Standard Business - 37.44% target)
  { id: 'ec24', name: 'Awal Dairy Co. WLL', type: 'End Customer', code: 'EC24', industry: 'food', grade: 'C', creditLimit: 35000, paymentDays: 50 },
  { id: 'ec69', name: 'Midal Cables Ltd', type: 'End Customer', code: 'EC69', industry: 'manufacturing', grade: 'C', creditLimit: 42000, paymentDays: 55 },
  { id: 'nr4', name: 'Al Hilal Group', type: 'National Reseller', code: 'NR4', industry: 'trading', grade: 'C', creditLimit: 28000, paymentDays: 48 },
  { id: 'nr21', name: 'BMMI - Global Sourcing and Supply', type: 'National Reseller', code: 'NR21', industry: 'trading', grade: 'C', creditLimit: 45000, paymentDays: 52 },
  { id: 'nr24', name: 'Central Power + Process Systems', type: 'National Reseller', code: 'NR24', industry: 'trading', grade: 'C', creditLimit: 32000, paymentDays: 46 },
  { id: 'nr42', name: 'Gulf Temperature Sensors WLL', type: 'National Reseller', code: 'NR42', industry: 'instrumentation', grade: 'C', creditLimit: 25000, paymentDays: 58 },
  { id: 'sp3', name: 'Al Kooheji Technical Services', type: 'Service Provider, Service Company', code: 'SP3', industry: 'services', grade: 'C', creditLimit: 30000, paymentDays: 50 },
  { id: 'sp11', name: 'JOHNSON CONTROLS', type: 'Service Provider, Service Company', code: 'SP11', industry: 'services', grade: 'C', creditLimit: 55000, paymentDays: 45 },
  { id: 'si7', name: 'ARROWFINCH TECHNOLOGIES WLL', type: 'System Integrator', code: 'SI7', industry: 'technology', grade: 'C', creditLimit: 38000, paymentDays: 48 },
  { id: 'si12', name: 'Comsip Al\'Ali W.L.L - Actemium', type: 'System Integrator', code: 'SI12', industry: 'technology', grade: 'C', creditLimit: 62000, paymentDays: 42 },
  { id: 'si19', name: 'LEOCOM', type: 'System Integrator', code: 'SI19', industry: 'technology', grade: 'C', creditLimit: 28000, paymentDays: 55 },

  // PH Trading itself
  { id: 'ph1', name: 'P H Trading W.L.L', type: 'PH Trading', code: 'PH1', industry: 'trading', grade: 'A', creditLimit: 500000, paymentDays: 15 }
];

// Generate enhanced customer data with V6.0 consciousness
const enhancedCustomers = customers.map(customer => {
  // Industry-specific email generation
  const emailDomains = {
    'petrochemical': 'operations',
    'manufacturing': 'procurement',
    'engineering': 'projects',
    'technology': 'solutions',
    'utilities': 'engineering',
    'power': 'technical',
    'food': 'supply',
    'trading': 'sales',
    'services': 'services'
  };

  const emailPrefix = emailDomains[customer.industry] || 'info';
  const domain = customer.name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 12) + '.com';

  return {
    ...customer,
    // Contact details
    customerCode: customer.code,
    email: `${emailPrefix}@${domain}`,
    phone: `+973 ${17000000 + Math.floor(Math.random() * 9999999)}`,
    address: `Building ${Math.floor(Math.random() * 999)}, Road ${Math.floor(Math.random() * 9999)}, Manama, Bahrain`,
    currency: 'BHD',
    gstin: `BH${customer.code}${Math.floor(Math.random() * 100000)}`,
    status: 'active',
    
    // Business intelligence
    relationshipYears: Math.round((0.5 + Math.random() * 8) * 10) / 10,
    averageOrderValue: Math.round(customer.creditLimit * (0.1 + Math.random() * 0.3)),
    totalOrderValue: Math.round(customer.creditLimit * (0.5 + Math.random() * 2)),
    orderFrequency: Math.round((2 + Math.random() * 8) * 10) / 10,
    lastOrderDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    
    // V6.0 Julius consciousness metadata
    competitiveWinRate: Math.round((0.6 + Math.random() * 0.3) * 100) / 100,
    primaryCompetitor: ['ABB', 'Siemens', 'Emerson', 'Honeywell'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

// Generate sample RFQs
const rfqs = [];
for (let i = 0; i < 15; i++) {
  const customer = enhancedCustomers[Math.floor(Math.random() * enhancedCustomers.length)];
  const daysAgo = Math.floor(Math.random() * 90);
  const receiveDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Industry-specific project names
  const projectTypes = {
    'petrochemical': ['Process Control Upgrade', 'Safety System Enhancement', 'Refinery Modernization'],
    'manufacturing': ['Production Line Automation', 'Quality Control System', 'Manufacturing Execution'],
    'engineering': ['Project Management System', 'Design Software Upgrade', 'CAD Integration'],
    'utilities': ['SCADA System Upgrade', 'Water Treatment Control', 'Smart Grid Implementation'],
    'power': ['Power Plant Control', 'Grid Management System', 'Turbine Monitoring']
  };
  
  const projects = projectTypes[customer.industry] || projectTypes['manufacturing'];
  const projectName = projects[Math.floor(Math.random() * projects.length)];
  
  rfqs.push({
    id: `rfq-${i + 1}`,
    rfqNumber: `RFQ-2025-${String(i + 1).padStart(3, '0')}`,
    customerId: customer.id,
    customer: customer.name,
    customerEmail: customer.email,
    project: `${projectName} 2025`,
    status: ['pending', 'quoted', 'won', 'lost'][Math.floor(Math.random() * 4)],
    source: ['email', 'website', 'tender', 'direct'][Math.floor(Math.random() * 4)],
    receiveDate: receiveDate.toISOString().split('T')[0],
    dueDate: new Date(receiveDate.getTime() + (14 + Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedValue: Math.round((15000 + Math.random() * 85000) * (customer.grade === 'A' ? 1.5 : customer.grade === 'B' ? 1.2 : 1)),
    notes: `${customer.industry} project requiring specialized instrumentation and control systems.`,
    items: [
      {
        description: 'Control System Hardware',
        quantity: Math.floor(1 + Math.random() * 5),
        unit: 'set',
        specifications: 'Industrial grade, hazardous area certified'
      },
      {
        description: 'Instrumentation Package',
        quantity: Math.floor(2 + Math.random() * 8),
        unit: 'pcs',
        specifications: 'High precision, network-enabled sensors'
      }
    ],
    createdAt: receiveDate.toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Generate sample quotations
const quotations = [];
const quotedRFQs = rfqs.filter(rfq => rfq.status === 'quoted' || rfq.status === 'won');
quotedRFQs.slice(0, 8).forEach((rfq, index) => {
  const customer = enhancedCustomers.find(c => c.id === rfq.customerId);
  const baseMarkup = 18; // V6.0 Julius-validated optimal margin
  
  // Customer intelligence-based margin adjustment
  let optimizedMarkup = baseMarkup;
  if (customer.grade === 'A') optimizedMarkup -= 3; // Loyalty discount
  if (customer.grade === 'B') optimizedMarkup -= 1; // Small discount
  if (customer.grade === 'D') optimizedMarkup += 2; // Risk premium
  
  const subtotal = rfq.estimatedValue * 0.85; // Estimated cost
  const total = Math.round(subtotal * (1 + optimizedMarkup / 100));
  
  quotations.push({
    id: `qt-${index + 1}`,
    quoteNumber: `QT-2025-${String(index + 1).padStart(3, '0')}`,
    rfqId: rfq.id,
    rfqNumber: rfq.rfqNumber,
    customerId: customer.id,
    customer: customer.name,
    customerEmail: customer.email,
    project: rfq.project,
    items: rfq.items.map(item => ({
      ...item,
      unitPrice: Math.round((subtotal / rfq.items.length) / item.quantity),
      totalPrice: Math.round((subtotal / rfq.items.length))
    })),
    subtotal: Math.round(subtotal),
    markup: optimizedMarkup,
    total: total,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ['draft', 'sent', 'approved'][Math.floor(Math.random() * 3)],
    deliveryTerms: customer.grade === 'A' ? '6-8 weeks Ex-Works' : '8-10 weeks Ex-Works',
    paymentTerms: customer.grade === 'A' ? '45 days net' : '30 days net',
    
    // V6.0 Customer intelligence
    customerIntelligence: {
      customerId: customer.id,
      customerCode: customer.customerCode,
      grade: customer.grade,
      industry: customer.industry,
      creditLimit: customer.creditLimit,
      optimizedMarkup: optimizedMarkup,
      originalMarkup: baseMarkup,
      marginAdjustment: optimizedMarkup - baseMarkup,
      riskProfile: customer.grade === 'D' ? 'HIGH' : customer.grade === 'A' ? 'LOW' : 'MEDIUM'
    },
    
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// Create database JSON file
const database = {
  customers: enhancedCustomers,
  rfqs: rfqs,
  quotations: quotations,
  orders: [], // Can be populated later
  oems: [] // Can be populated later
};

// Write to database.json
const dbPath = path.join(dataDir, 'database.json');
fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));

// Generate analytics summary
const gradeCount = enhancedCustomers.reduce((acc, customer) => {
  acc[customer.grade] = (acc[customer.grade] || 0) + 1;
  return acc;
}, {});

const totalCustomers = enhancedCustomers.length;

console.log('🎯 PH Trading Demo Data Creator');
console.log('===============================');
console.log('');
console.log('✅ Successfully created demo data files!');
console.log('');
console.log(`📊 Customer Data Summary:`);
console.log(`   Total Customers: ${totalCustomers}`);
console.log(`   A-Grade: ${gradeCount.A || 0} (${Math.round((gradeCount.A || 0) / totalCustomers * 100)}%) - Target: 33.85%`);
console.log(`   B-Grade: ${gradeCount.B || 0} (${Math.round((gradeCount.B || 0) / totalCustomers * 100)}%) - Target: 28.72%`);
console.log(`   C-Grade: ${gradeCount.C || 0} (${Math.round((gradeCount.C || 0) / totalCustomers * 100)}%) - Target: 37.44%`);
console.log('');
console.log(`📋 Business Flow Data:`);
console.log(`   RFQs: ${rfqs.length} with realistic industry projects`);
console.log(`   Quotations: ${quotations.length} with V6.0 consciousness-guided pricing`);
console.log(`   Customer Intelligence: Grade-based pricing & terms optimization`);
console.log('');
console.log(`📁 Data Files Created:`);
console.log(`   ${dbPath}`);
console.log('');
console.log('🚀 Your PH Trading ERP is now demo-ready!');
console.log('   Customer search, RFQ creation, and analytics will show realistic data');
console.log('   All V6.0 Julius-validated intelligence is working behind the scenes');
console.log('');
console.log('🌟 Start the application with: npm run dev');

module.exports = { database };