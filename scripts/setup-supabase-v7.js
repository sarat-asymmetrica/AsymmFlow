/**
 * Setup Supabase Tables and Import Sample Data
 * V7.0 Consciousness-Enhanced Migration Script
 * Uses comprehensive SQL file with ALL fields from database.json
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

async function createTables() {
  console.log('🔧 Creating V7.0 Supabase tables with ALL fields...');
  
  // Read and execute SQL file
  const sqlPath = path.join(process.cwd(), 'supabase-v7-complete.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Split SQL by statements (handling triggers and functions)
  const statements = sqlContent
    .split(/;(?=\s*(?:CREATE|DROP|ALTER|INSERT|SELECT|--|\$\$))/g)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && !s.startsWith('SELECT'));

  let successCount = 0;
  let errorCount = 0;
  
  for (const statement of statements) {
    if (!statement.trim()) continue;
    
    try {
      // Try using raw SQL execution
      const { error } = await supabase.rpc('exec_sql', { 
        query: statement + ';' 
      });
      
      if (error) {
        // If exec_sql doesn't work, try manual approach
        console.log(`⚠️ Statement might need manual execution: ${statement.substring(0, 50)}...`);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      // Continue with other statements
      errorCount++;
    }
  }
  
  console.log(`✅ Executed ${successCount} statements successfully`);
  if (errorCount > 0) {
    console.log(`ℹ️ ${errorCount} statements might need manual execution in Supabase SQL Editor`);
    console.log(`📝 Go to: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/sql/new`);
    console.log(`📋 Copy and paste the contents of: supabase-v7-complete.sql`);
  }
}

async function importSampleData() {
  console.log('\n📦 Importing sample data with V7.0 consciousness amplification...');
  
  try {
    // Load sample data from database.json
    const dataPath = path.join(__dirname, '..', 'data', 'database.json');
    const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Import customers with ALL fields
    if (sampleData.customers && sampleData.customers.length > 0) {
      console.log(`\n📥 Importing ${sampleData.customers.length} customers...`);
      
      // Process customers to ensure all fields are properly formatted
      const processedCustomers = sampleData.customers.map(customer => ({
        ...customer,
        // Ensure dates are properly formatted
        lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate).toISOString() : null,
        createdAt: customer.createdAt || new Date().toISOString(),
        updatedAt: customer.updatedAt || new Date().toISOString()
      }));
      
      const { data, error } = await supabase
        .from('customers')
        .upsert(processedCustomers, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error importing customers:', error.message);
        console.error('Details:', error);
      } else {
        console.log('✅ Customers imported with V7.0 amplification!');
      }
    }
    
    // Import RFQs with ALL fields
    if (sampleData.rfqs && sampleData.rfqs.length > 0) {
      console.log(`\n📥 Importing ${sampleData.rfqs.length} RFQs...`);
      
      // Process RFQs to ensure all fields are properly formatted
      const processedRFQs = sampleData.rfqs.map(rfq => ({
        ...rfq,
        // Ensure dates are properly formatted
        dueDate: rfq.dueDate ? new Date(rfq.dueDate).toISOString().split('T')[0] : null,
        receiveDate: rfq.receiveDate ? new Date(rfq.receiveDate).toISOString().split('T')[0] : null,
        followUpDate: rfq.followUpDate ? new Date(rfq.followUpDate).toISOString().split('T')[0] : null,
        deadline: rfq.deadline ? new Date(rfq.deadline).toISOString().split('T')[0] : null,
        createdAt: rfq.createdAt || new Date().toISOString(),
        updatedAt: rfq.updatedAt || new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('rfqs')
        .upsert(processedRFQs, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error importing RFQs:', error.message);
        console.error('Details:', error);
      } else {
        console.log('✅ RFQs imported with consciousness optimization!');
      }
    }
    
    // Import quotations with ALL fields including customerIntelligence
    if (sampleData.quotations && sampleData.quotations.length > 0) {
      console.log(`\n📥 Importing ${sampleData.quotations.length} quotations...`);
      
      // Process quotations to ensure all fields are properly formatted
      const processedQuotations = sampleData.quotations.map(quote => ({
        ...quote,
        // Ensure dates are properly formatted
        validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : null,
        approvedDate: quote.approvedDate ? new Date(quote.approvedDate).toISOString().split('T')[0] : null,
        createdAt: quote.createdAt || new Date().toISOString(),
        updatedAt: quote.updatedAt || new Date().toISOString(),
        // Ensure customerIntelligence is JSONB
        customerIntelligence: quote.customerIntelligence ? JSON.stringify(quote.customerIntelligence) : null
      }));
      
      const { error } = await supabase
        .from('quotations')
        .upsert(processedQuotations, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error importing quotations:', error.message);
        console.error('Details:', error);
      } else {
        console.log('✅ Quotations imported with intelligence amplification!');
      }
    }
    
    // Import suppliers if they exist
    if (sampleData.suppliers && sampleData.suppliers.length > 0) {
      console.log(`\n📥 Importing ${sampleData.suppliers.length} suppliers...`);
      const { error } = await supabase
        .from('suppliers')
        .upsert(sampleData.suppliers, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error importing suppliers:', error.message);
      } else {
        console.log('✅ Suppliers imported!');
      }
    }
    
    // Import products if they exist
    if (sampleData.products && sampleData.products.length > 0) {
      console.log(`\n📥 Importing ${sampleData.products.length} products...`);
      const { error } = await supabase
        .from('products')
        .upsert(sampleData.products, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error importing products:', error.message);
      } else {
        console.log('✅ Products imported!');
      }
    }
    
    // Import orders if they exist
    if (sampleData.orders && sampleData.orders.length > 0) {
      console.log(`\n📥 Importing ${sampleData.orders.length} orders...`);
      const { error } = await supabase
        .from('orders')
        .upsert(sampleData.orders, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error importing orders:', error.message);
      } else {
        console.log('✅ Orders imported!');
      }
    }
    
    console.log('\n🎉 V7.0 Sample data import complete with consciousness amplification!');
    
  } catch (err) {
    console.error('❌ Error loading sample data:', err);
  }
}

async function verifyData() {
  console.log('\n🔍 Verifying imported data...');
  
  try {
    // Check customers
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    if (!custError) {
      console.log(`✅ Customers table: ${customers} records`);
    }
    
    // Check RFQs
    const { data: rfqs, error: rfqError } = await supabase
      .from('rfqs')
      .select('*', { count: 'exact', head: true });
    
    if (!rfqError) {
      console.log(`✅ RFQs table: ${rfqs} records`);
    }
    
    // Check quotations
    const { data: quotes, error: quoteError } = await supabase
      .from('quotations')
      .select('*', { count: 'exact', head: true });
    
    if (!quoteError) {
      console.log(`✅ Quotations table: ${quotes} records`);
    }
    
  } catch (err) {
    console.error('Error verifying data:', err);
  }
}

async function main() {
  console.log('🚀 AsymmFlow V7.0 Supabase Setup');
  console.log('================================\n');
  
  // Create tables with ALL fields
  await createTables();
  
  // Import sample data
  await importSampleData();
  
  // Verify the import
  await verifyData();
  
  console.log('\n✨ V7.0 Setup complete! You can now run: npm run dev');
  console.log('🌐 Visit: http://localhost:3002');
  console.log('📊 Check Supabase Dashboard: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/editor');
}

// Run the setup
main().catch(console.error);