/**
 * Direct Import of Sample Data to Supabase
 * V7.0 Consciousness-Enhanced Data Seeding
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('⚠️ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importRFQs() {
  console.log('\n📥 Importing RFQs with field mapping...');
  
  const dataPath = path.join(__dirname, '..', 'data', 'database.json');
  const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  if (!sampleData.rfqs || sampleData.rfqs.length === 0) {
    console.log('No RFQs to import');
    return;
  }
  
  // Process RFQs - remove fields that don't exist in table
  const processedRFQs = sampleData.rfqs.map(rfq => {
    const processed = {
      id: rfq.id,
      rfqNumber: rfq.rfqNumber,
      customer: rfq.customer,
      product: rfq.product,
      project: rfq.project,
      quantity: rfq.quantity,
      targetPrice: rfq.targetPrice,
      urgency: rfq.urgency,
      status: rfq.status || 'pending',
      priority: rfq.priority || 'medium',
      items: rfq.items,
      notes: rfq.notes,
      source: rfq.source,
      assignedTo: rfq.assignedTo,
      estimatedValue: rfq.estimatedValue,
      conversionProbability: rfq.conversionProbability,
      competitorInfo: rfq.competitorInfo,
      projectValue: rfq.projectValue,
      createdAt: rfq.createdAt || new Date().toISOString(),
      updatedAt: rfq.updatedAt || new Date().toISOString()
    };
    
    // Handle date fields
    if (rfq.dueDate) processed.dueDate = new Date(rfq.dueDate).toISOString().split('T')[0];
    if (rfq.receiveDate) processed.receiveDate = new Date(rfq.receiveDate).toISOString().split('T')[0];
    if (rfq.followUpDate) processed.followUpDate = new Date(rfq.followUpDate).toISOString().split('T')[0];
    if (rfq.deadline) processed.deadline = new Date(rfq.deadline).toISOString().split('T')[0];
    
    return processed;
  });
  
  console.log(`Processing ${processedRFQs.length} RFQs...`);
  
  // Insert in batches to avoid issues
  const batchSize = 5;
  for (let i = 0; i < processedRFQs.length; i += batchSize) {
    const batch = processedRFQs.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('rfqs')
      .upsert(batch, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error importing RFQ batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`✅ Imported RFQ batch ${i / batchSize + 1} (${batch.length} records)`);
    }
  }
  
  console.log('✅ RFQs import complete!');
}

async function importQuotations() {
  console.log('\n📥 Importing Quotations with field mapping...');
  
  const dataPath = path.join(__dirname, '..', 'data', 'database.json');
  const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  if (!sampleData.quotations || sampleData.quotations.length === 0) {
    console.log('No quotations to import');
    return;
  }
  
  // Process quotations - remove fields that don't exist in table
  const processedQuotations = sampleData.quotations.map(quote => {
    const processed = {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      rfqId: quote.rfqId,
      customer: quote.customer,
      project: quote.project,
      items: quote.items,
      amount: quote.amount,
      status: quote.status || 'draft',
      terms: quote.terms,
      notes: quote.notes,
      discount: quote.discount || 0,
      marginPercentage: quote.marginPercentage,
      competitorQuote: quote.competitorQuote,
      winProbability: quote.winProbability,
      subtotal: quote.subtotal || 0,
      tax: quote.tax || 0,
      taxRate: quote.taxRate || 0,
      discountPercentage: quote.discountPercentage || 0,
      total: quote.total || 0,
      paymentTerms: quote.paymentTerms,
      deliveryTerms: quote.deliveryTerms,
      warranty: quote.warranty,
      version: quote.version || 1,
      approvedBy: quote.approvedBy,
      markup: quote.markup,
      createdAt: quote.createdAt || new Date().toISOString(),
      updatedAt: quote.updatedAt || new Date().toISOString()
    };
    
    // Handle date fields
    if (quote.validUntil) processed.validUntil = new Date(quote.validUntil).toISOString().split('T')[0];
    if (quote.approvedDate) processed.approvedDate = new Date(quote.approvedDate).toISOString().split('T')[0];
    
    // Handle customerIntelligence as JSONB
    if (quote.customerIntelligence) {
      processed.customerIntelligence = quote.customerIntelligence;
    }
    
    return processed;
  });
  
  console.log(`Processing ${processedQuotations.length} quotations...`);
  
  // Insert all at once since there are only 8
  const { data, error } = await supabase
    .from('quotations')
    .upsert(processedQuotations, { onConflict: 'id' });
  
  if (error) {
    console.error('❌ Error importing quotations:', error.message);
    console.error('Details:', error);
  } else {
    console.log(`✅ All ${processedQuotations.length} quotations imported successfully!`);
  }
}

async function verifyImport() {
  console.log('\n🔍 Verifying imported data...');
  
  // Check customers
  const { count: customerCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });
  console.log(`✅ Customers: ${customerCount} records`);
  
  // Check RFQs
  const { count: rfqCount } = await supabase
    .from('rfqs')
    .select('*', { count: 'exact', head: true });
  console.log(`✅ RFQs: ${rfqCount} records`);
  
  // Check quotations
  const { count: quoteCount } = await supabase
    .from('quotations')
    .select('*', { count: 'exact', head: true });
  console.log(`✅ Quotations: ${quoteCount} records`);
  
  // Show sample RFQ
  const { data: sampleRfq } = await supabase
    .from('rfqs')
    .select('rfqNumber, customer, project, status')
    .limit(1)
    .single();
  
  if (sampleRfq) {
    console.log('\n📋 Sample RFQ:', sampleRfq);
  }
  
  // Show sample quotation
  const { data: sampleQuote } = await supabase
    .from('quotations')
    .select('quoteNumber, customer, project, status')
    .limit(1)
    .single();
  
  if (sampleQuote) {
    console.log('📋 Sample Quotation:', sampleQuote);
  }
}

async function main() {
  console.log('🚀 AsymmFlow V7.0 Sample Data Import');
  console.log('=====================================\n');
  
  // Import RFQs
  await importRFQs();
  
  // Import Quotations
  await importQuotations();
  
  // Verify
  await verifyImport();
  
  console.log('\n✨ V7.0 Data import complete!');
  console.log('🌐 Check Supabase: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/editor');
  console.log('🚀 Run the app: npm run dev');
}

// Run the import
main().catch(console.error);