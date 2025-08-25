-- AsymmFlow V7.0 Direct SQL for Supabase Dashboard
-- Go to: https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/sql/new
-- Copy and paste this entire file

-- Clean slate
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.quotations CASCADE;
DROP TABLE IF EXISTS public.rfqs CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.v7_migrations CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table with ALL fields from database.json
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
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RFQs table with ALL fields from database.json
CREATE TABLE public.rfqs (
  id TEXT PRIMARY KEY,
  "rfqNumber" TEXT UNIQUE,
  customer TEXT,
  product TEXT,
  project TEXT,
  quantity INTEGER,
  "targetPrice" DECIMAL(15,2),
  urgency TEXT,
  status TEXT DEFAULT 'pending',
  "dueDate" DATE,
  "receiveDate" DATE,
  "estimatedValue" DECIMAL(15,2),
  "followUpDate" DATE,
  "competitorInfo" TEXT,
  "projectValue" DECIMAL(15,2),
  priority TEXT DEFAULT 'medium',
  "conversionProbability" DECIMAL(5,2),
  items JSONB,
  deadline DATE,
  notes TEXT,
  source TEXT,
  "assignedTo" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotations table with ALL fields from database.json
CREATE TABLE public.quotations (
  id TEXT PRIMARY KEY,
  "quoteNumber" TEXT UNIQUE,
  "rfqId" TEXT,
  customer TEXT,
  project TEXT,
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
  "customerIntelligence" JSONB,
  markup DECIMAL(15,2),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_rfqs_customer ON rfqs(customer);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_quotations_customer ON quotations(customer);
CREATE INDEX idx_quotations_status ON quotations(status);

-- Enable Row Level Security (but allow all for now)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Create open policies for development
CREATE POLICY "Allow all operations" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON rfqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON quotations FOR ALL USING (true) WITH CHECK (true);

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

-- Success!
SELECT 'V7.0 Tables Created! Now run: npm run setup:v7' as message;