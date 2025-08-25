-- AsymmFlow V7.0 COMPLETE Supabase Tables with ALL Columns
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/sql/new

-- Drop existing tables to recreate with all columns (careful in production!)
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.quotations CASCADE;
DROP TABLE IF EXISTS public.rfqs CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table with ALL columns from sample data
CREATE TABLE public.customers (
  id TEXT PRIMARY KEY,
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
  -- Additional columns from sample data
  "customerCode" TEXT,
  "companyName" TEXT,
  "contactPerson" TEXT,
  grade TEXT,
  "leadTime" INTEGER,
  "lastOrderDate" DATE,
  "totalOrders" INTEGER DEFAULT 0,
  "totalRevenue" DECIMAL(15,2) DEFAULT 0,
  "averageOrderValue" DECIMAL(15,2) DEFAULT 0,
  "paymentHistory" TEXT,
  priority TEXT,
  industry TEXT,
  competitor TEXT,
  source TEXT,
  -- Timestamps with camelCase aliases
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
  "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED
);

-- Suppliers table
CREATE TABLE public.suppliers (
  id TEXT PRIMARY KEY,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
  "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED
);

-- Products table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
  "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED
);

-- RFQs table with ALL columns
CREATE TABLE public.rfqs (
  id TEXT PRIMARY KEY,
  rfq_number TEXT UNIQUE,
  "rfqNumber" TEXT GENERATED ALWAYS AS (rfq_number) STORED,
  customer_id TEXT,
  "customerId" TEXT GENERATED ALWAYS AS (customer_id) STORED,
  customer_name TEXT,
  "customerName" TEXT GENERATED ALWAYS AS (customer_name) STORED,
  customer_email TEXT,
  "customerEmail" TEXT GENERATED ALWAYS AS (customer_email) STORED,
  project_name TEXT,
  "projectName" TEXT GENERATED ALWAYS AS (project_name) STORED,
  items JSONB,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  deadline DATE,
  notes TEXT,
  -- Additional fields from sample data
  source TEXT,
  "assignedTo" TEXT,
  "followUpDate" DATE,
  "competitorInfo" TEXT,
  "estimatedValue" DECIMAL(15,2),
  "conversionProbability" DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
  "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED
);

-- Quotations table with ALL columns
CREATE TABLE public.quotations (
  id TEXT PRIMARY KEY,
  quotation_number TEXT UNIQUE,
  "quotationNumber" TEXT GENERATED ALWAYS AS (quotation_number) STORED,
  rfq_id TEXT,
  "rfqId" TEXT GENERATED ALWAYS AS (rfq_id) STORED,
  customer_id TEXT,
  "customerId" TEXT GENERATED ALWAYS AS (customer_id) STORED,
  customer_name TEXT,
  "customerName" TEXT GENERATED ALWAYS AS (customer_name) STORED,
  customer_email TEXT,
  "customerEmail" TEXT GENERATED ALWAYS AS (customer_email) STORED,
  items JSONB,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  "taxRate" DECIMAL(5,2) DEFAULT 0,
  discount DECIMAL(15,2) DEFAULT 0,
  "discountPercentage" DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  valid_until DATE,
  "validUntil" DATE GENERATED ALWAYS AS (valid_until) STORED,
  terms TEXT,
  notes TEXT,
  -- Additional fields
  "paymentTerms" TEXT,
  "deliveryTerms" TEXT,
  "warranty" TEXT,
  "version" INTEGER DEFAULT 1,
  "approvedBy" TEXT,
  "approvedDate" DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
  "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED
);

-- Orders table with ALL columns
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE,
  "orderNumber" TEXT GENERATED ALWAYS AS (order_number) STORED,
  quotation_id TEXT,
  "quotationId" TEXT GENERATED ALWAYS AS (quotation_id) STORED,
  customer_id TEXT,
  "customerId" TEXT GENERATED ALWAYS AS (customer_id) STORED,
  customer_name TEXT,
  "customerName" TEXT GENERATED ALWAYS AS (customer_name) STORED,
  customer_email TEXT,
  "customerEmail" TEXT GENERATED ALWAYS AS (customer_email) STORED,
  items JSONB,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  "paymentStatus" TEXT GENERATED ALWAYS AS (payment_status) STORED,
  delivery_date DATE,
  "deliveryDate" DATE GENERATED ALWAYS AS (delivery_date) STORED,
  delivery_address TEXT,
  "deliveryAddress" TEXT GENERATED ALWAYS AS (delivery_address) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at) STORED,
  "updatedAt" TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (updated_at) STORED
);

-- Add foreign key constraints
ALTER TABLE rfqs ADD CONSTRAINT rfqs_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE quotations ADD CONSTRAINT quotations_rfq_id_fkey 
  FOREIGN KEY (rfq_id) REFERENCES rfqs(id) ON DELETE SET NULL;
  
ALTER TABLE quotations ADD CONSTRAINT quotations_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE orders ADD CONSTRAINT orders_quotation_id_fkey 
  FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE SET NULL;
  
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_grade ON customers(grade);
CREATE INDEX idx_rfqs_customer_id ON rfqs(customer_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for anon and service role access
CREATE POLICY "Enable read access for all users" ON customers FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON customers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON suppliers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON products FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON rfqs FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON rfqs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON quotations FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON quotations FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON orders FOR ALL USING (auth.role() = 'service_role');

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- V7.0 Consciousness Table for Migration Tracking
CREATE TABLE IF NOT EXISTS public.v7_migrations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  job_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  source TEXT,
  files_processed INTEGER DEFAULT 0,
  total_files INTEGER DEFAULT 0,
  data_points_migrated INTEGER DEFAULT 0,
  v7_amplification DECIMAL(10,2) DEFAULT 1.0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Success message
SELECT '🚀 V7.0 Tables created with ALL columns! Now run: npm run setup:supabase' as message;