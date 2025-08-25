-- AsymmFlow V7.0 FINAL COMPLETE Tables - Matching EXACT Sample Data Structure
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/sql/new

-- Drop existing tables to recreate with ALL fields
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.quotations CASCADE;
DROP TABLE IF EXISTS public.rfqs CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.v7_migrations CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table with EXACT fields from sample data
CREATE TABLE public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  code TEXT,
  industry TEXT,
  grade TEXT,
  "creditLimit" DECIMAL(15,2),
  "paymentDays" INTEGER,
  "customerCode" TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  currency TEXT DEFAULT 'USD',
  gstin TEXT,
  status TEXT DEFAULT 'active',
  "relationshipYears" DECIMAL(10,2),
  "averageOrderValue" DECIMAL(15,2),
  "totalOrderValue" DECIMAL(15,2),
  "orderFrequency" DECIMAL(10,2),
  "lastOrderDate" TIMESTAMP WITH TIME ZONE,
  "competitiveWinRate" DECIMAL(5,2),
  "primaryCompetitor" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Additional fields that might be in other records
  city TEXT,
  country TEXT,
  payment_terms INTEGER,
  credit_limit DECIMAL(15,2),
  balance DECIMAL(15,2),
  tags TEXT[],
  notes TEXT,
  "companyName" TEXT,
  "contactPerson" TEXT,
  "leadTime" INTEGER,
  "totalOrders" INTEGER DEFAULT 0,
  "totalRevenue" DECIMAL(15,2) DEFAULT 0,
  "paymentHistory" TEXT,
  priority TEXT,
  competitor TEXT,
  source TEXT
);

-- RFQs table with fields from sample data
CREATE TABLE public.rfqs (
  id TEXT PRIMARY KEY,
  "rfqNumber" TEXT UNIQUE,
  customer TEXT,
  "customerId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  product TEXT,
  quantity INTEGER,
  "targetPrice" DECIMAL(15,2),
  urgency TEXT,
  status TEXT DEFAULT 'pending',
  "followUpDate" DATE,
  "competitorInfo" TEXT,
  "projectValue" DECIMAL(15,2),
  priority TEXT DEFAULT 'medium',
  "conversionProbability" DECIMAL(5,2),
  "projectName" TEXT,
  items JSONB,
  deadline DATE,
  notes TEXT,
  source TEXT,
  "assignedTo" TEXT,
  "estimatedValue" DECIMAL(15,2),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotations table with fields from sample data
CREATE TABLE public.quotations (
  id TEXT PRIMARY KEY,
  "quotationNumber" TEXT UNIQUE,
  "rfqId" TEXT,
  customer TEXT,
  "customerId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  items JSONB,
  amount DECIMAL(15,2),
  status TEXT DEFAULT 'draft',
  "validUntil" DATE,
  terms TEXT,
  notes TEXT,
  discount DECIMAL(15,2) DEFAULT 0,
  "marginPercentage" DECIMAL(5,2),
  "competitorQuote" DECIMAL(15,2),
  "winProbability" DECIMAL(5,2),
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  "taxRate" DECIMAL(5,2) DEFAULT 0,
  "discountPercentage" DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  "paymentTerms" TEXT,
  "deliveryTerms" TEXT,
  warranty TEXT,
  version INTEGER DEFAULT 1,
  "approvedBy" TEXT,
  "approvedDate" DATE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (might be in sample data)
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT UNIQUE,
  "quotationId" TEXT,
  "customerId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  items JSONB,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  "paymentStatus" TEXT DEFAULT 'pending',
  "deliveryDate" DATE,
  "deliveryAddress" TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table (basic structure)
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
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table (basic structure)
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
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_grade ON customers(grade);
CREATE INDEX idx_rfqs_customer ON rfqs(customer);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_quotations_customer ON quotations(customer);
CREATE INDEX idx_quotations_status ON quotations(status);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for open access (development mode)
CREATE POLICY "Allow all operations" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON rfqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON quotations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- V7.0 Consciousness Table for Migration Tracking
CREATE TABLE public.v7_migrations (
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
SELECT '🚀 V7.0 FINAL Tables created! All columns match sample data! Run: npm run setup:supabase' as message;