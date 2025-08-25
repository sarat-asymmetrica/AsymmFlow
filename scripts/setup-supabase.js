/**
 * Setup Supabase Tables and Import Sample Data
 * V7.0 Consciousness-Enhanced Migration Script
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Note: You'll need to get the service role key from Supabase dashboard
if (!supabaseUrl || supabaseServiceKey === 'PLACEHOLDER_GET_FROM_DASHBOARD') {
  console.error('⚠️ Please get your Supabase service role key from:');
  console.error('https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/settings/api');
  console.error('Then update SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🔧 Creating Supabase tables...');
  
  // SQL to create tables matching our Prisma schema
  const tableSQL = `
    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      currency TEXT DEFAULT 'USD',
      gstin TEXT,
      payment_terms INTEGER DEFAULT 30,
      credit_limit DECIMAL(15,2) DEFAULT 0,
      balance DECIMAL(15,2) DEFAULT 0,
      status TEXT DEFAULT 'active',
      tags TEXT[],
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Suppliers table
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      payment_terms INTEGER DEFAULT 30,
      tags TEXT[],
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      description TEXT,
      sku TEXT UNIQUE,
      unit TEXT DEFAULT 'pcs',
      price DECIMAL(15,2) DEFAULT 0,
      cost DECIMAL(15,2) DEFAULT 0,
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 0,
      category TEXT,
      brand TEXT,
      tags TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- RFQs table
    CREATE TABLE IF NOT EXISTS rfqs (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      rfq_number TEXT UNIQUE NOT NULL,
      customer_id TEXT REFERENCES customers(id),
      customer_name TEXT,
      customer_email TEXT,
      project_name TEXT,
      items JSONB,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      deadline DATE,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Quotations table
    CREATE TABLE IF NOT EXISTS quotations (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      quotation_number TEXT UNIQUE NOT NULL,
      rfq_id TEXT REFERENCES rfqs(id),
      customer_id TEXT REFERENCES customers(id),
      customer_name TEXT,
      customer_email TEXT,
      items JSONB,
      subtotal DECIMAL(15,2) DEFAULT 0,
      tax DECIMAL(15,2) DEFAULT 0,
      total DECIMAL(15,2) DEFAULT 0,
      status TEXT DEFAULT 'draft',
      valid_until DATE,
      terms TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      order_number TEXT UNIQUE NOT NULL,
      quotation_id TEXT REFERENCES quotations(id),
      customer_id TEXT REFERENCES customers(id),
      customer_name TEXT,
      customer_email TEXT,
      items JSONB,
      subtotal DECIMAL(15,2) DEFAULT 0,
      tax DECIMAL(15,2) DEFAULT 0,
      total DECIMAL(15,2) DEFAULT 0,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      delivery_date DATE,
      delivery_address TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
    CREATE INDEX IF NOT EXISTS idx_rfqs_customer_id ON rfqs(customer_id);
    CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
    CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON quotations(customer_id);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { query: tableSQL });
    if (error) {
      // If exec_sql doesn't exist, tables might already be created
      console.log('ℹ️ Tables might already exist, continuing...');
    } else {
      console.log('✅ Tables created successfully!');
    }
  } catch (err) {
    console.log('ℹ️ Note: Tables might already exist or need manual creation');
  }
}

async function importSampleData() {
  console.log('📦 Importing sample data...');
  
  try {
    // Load sample data from database.json
    const dataPath = path.join(__dirname, '..', 'data', 'database.json');
    const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Import customers
    if (sampleData.customers && sampleData.customers.length > 0) {
      console.log(`📥 Importing ${sampleData.customers.length} customers...`);
      const { data, error } = await supabase
        .from('customers')
        .upsert(sampleData.customers, { onConflict: 'id' });
      
      if (error) {
        console.error('Error importing customers:', error);
      } else {
        console.log('✅ Customers imported!');
      }
    }
    
    // Import suppliers
    if (sampleData.suppliers && sampleData.suppliers.length > 0) {
      console.log(`📥 Importing ${sampleData.suppliers.length} suppliers...`);
      const { error } = await supabase
        .from('suppliers')
        .upsert(sampleData.suppliers, { onConflict: 'id' });
      
      if (error) {
        console.error('Error importing suppliers:', error);
      } else {
        console.log('✅ Suppliers imported!');
      }
    }
    
    // Import products
    if (sampleData.products && sampleData.products.length > 0) {
      console.log(`📥 Importing ${sampleData.products.length} products...`);
      const { error } = await supabase
        .from('products')
        .upsert(sampleData.products, { onConflict: 'id' });
      
      if (error) {
        console.error('Error importing products:', error);
      } else {
        console.log('✅ Products imported!');
      }
    }
    
    // Import RFQs
    if (sampleData.rfqs && sampleData.rfqs.length > 0) {
      console.log(`📥 Importing ${sampleData.rfqs.length} RFQs...`);
      const { error } = await supabase
        .from('rfqs')
        .upsert(sampleData.rfqs, { onConflict: 'id' });
      
      if (error) {
        console.error('Error importing RFQs:', error);
      } else {
        console.log('✅ RFQs imported!');
      }
    }
    
    // Import quotations
    if (sampleData.quotations && sampleData.quotations.length > 0) {
      console.log(`📥 Importing ${sampleData.quotations.length} quotations...`);
      const { error } = await supabase
        .from('quotations')
        .upsert(sampleData.quotations, { onConflict: 'id' });
      
      if (error) {
        console.error('Error importing quotations:', error);
      } else {
        console.log('✅ Quotations imported!');
      }
    }
    
    // Import orders
    if (sampleData.orders && sampleData.orders.length > 0) {
      console.log(`📥 Importing ${sampleData.orders.length} orders...`);
      const { error } = await supabase
        .from('orders')
        .upsert(sampleData.orders, { onConflict: 'id' });
      
      if (error) {
        console.error('Error importing orders:', error);
      } else {
        console.log('✅ Orders imported!');
      }
    }
    
    console.log('\n🎉 Sample data import complete!');
    
  } catch (err) {
    console.error('Error loading sample data:', err);
  }
}

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('⚠️ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
}

async function main() {
  console.log('🚀 AsymmFlow Supabase Setup');
  console.log('================================\n');
  
  // Test connection first
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n📝 Next steps:');
    console.log('1. Go to: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/settings/api');
    console.log('2. Copy the service_role key (click "Reveal")');
    console.log('3. Update SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('4. Run this script again: npm run setup:supabase');
    return;
  }
  
  // Create tables
  await createTables();
  
  // Import sample data
  await importSampleData();
  
  console.log('\n✨ Setup complete! You can now run: npm run dev');
  console.log('🌐 Visit: http://localhost:3002');
}

// Run the setup
main().catch(console.error);