/**
 * Production Data Seeding Script
 * Extracts real business data from their OneDrive and seeds Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { Client } from '@microsoft/microsoft-graph-client';
import * as XLSX from 'xlsx';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Microsoft Graph client for OneDrive access
async function getAppGraphClient(): Promise<Client> {
  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });

  const tokens = await tokenResponse.json();
  
  return Client.init({
    authProvider: (done) => {
      done(null, tokens.access_token);
    }
  });
}

// Parse Excel file content for customer data
async function parseExcelFile(fileId: string, graphClient: Client): Promise<any[]> {
  try {
    // Download Excel file from OneDrive
    const fileContent = await graphClient
      .api(`/drive/items/${fileId}/content`)
      .get();
    
    // Parse Excel content
    const workbook = XLSX.read(fileContent, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
    
  } catch (error) {
    console.error(`Error parsing Excel file ${fileId}:`, error);
    return [];
  }
}

// Extract customer data from OneDrive folder structure
export async function seedCustomersFromOneDrive() {
  console.log('🏢 Seeding customers from OneDrive...');
  
  try {
    const graphClient = await getAppGraphClient();
    
    // List files in customers folder
    const customerFolder = await graphClient
      .api('/drive/root:/PH-Trading-Business/Customers/:/children')
      .get();
    
    const customers = [];
    
    for (const file of customerFolder.value || []) {
      if (file.name.includes('.xlsx') && file.name.toLowerCase().includes('customer')) {
        console.log(`📋 Processing customer file: ${file.name}`);
        
        const excelData = await parseExcelFile(file.id, graphClient);
        
        // Map Excel data to customer schema
        for (const row of excelData) {
          const customer = {
            company_name: row['Company Name'] || row['Customer Name'] || row.Company || 'Unknown Company',
            contact_person: row['Contact Person'] || row.Contact || null,
            email: row['Email'] || row['Email Address'] || null,
            phone: row['Phone'] || row['Phone Number'] || null,
            address: row['Address'] || null,
            currency: row['Currency'] || 'QAR',
            credit_limit: parseFloat(row['Credit Limit'] || '0') || null,
            payment_terms: parseInt(row['Payment Terms'] || '30') || 30
          };
          
          // Only add if we have a valid company name
          if (customer.company_name && customer.company_name !== 'Unknown Company') {
            customers.push(customer);
          }
        }
      }
    }
    
    if (customers.length > 0) {
      // Insert customers into Supabase
      const { data, error } = await supabase
        .from('customers')
        .insert(customers)
        .select();
      
      if (error) {
        console.error('❌ Error seeding customers:', error);
      } else {
        console.log(`✅ Successfully seeded ${customers.length} customers!`);
      }
    } else {
      console.log('ℹ️  No customer data found to seed');
    }
    
    return customers;
    
  } catch (error) {
    console.error('❌ Error in customer seeding:', error);
    return [];
  }
}

// Extract quotation data from OneDrive
export async function seedQuotationsFromOneDrive() {
  console.log('📋 Seeding quotations from OneDrive...');
  
  try {
    const graphClient = await getAppGraphClient();
    
    // List files in quotations folder
    const quotationFolder = await graphClient
      .api('/drive/root:/PH-Trading-Business/Quotations/:/children')
      .get();
    
    const quotations = [];
    
    for (const file of quotationFolder.value || []) {
      if (file.name.includes('.xlsx') || file.name.includes('QUO-')) {
        console.log(`📊 Processing quotation file: ${file.name}`);
        
        // Extract quotation number from filename
        const quotationNumber = extractQuotationNumber(file.name);
        
        if (quotationNumber) {
          const quotation = {
            quotation_number: quotationNumber,
            title: extractTitleFromFilename(file.name),
            status: 'completed', // Assuming historical quotations are completed
            created_at: file.lastModifiedDateTime || new Date().toISOString(),
            file_reference: file.id
          };
          
          quotations.push(quotation);
        }
      }
    }
    
    if (quotations.length > 0) {
      // Insert quotations into Supabase
      const { data, error } = await supabase
        .from('quotations')
        .insert(quotations)
        .select();
      
      if (error) {
        console.error('❌ Error seeding quotations:', error);
      } else {
        console.log(`✅ Successfully seeded ${quotations.length} quotations!`);
      }
    }
    
    return quotations;
    
  } catch (error) {
    console.error('❌ Error in quotation seeding:', error);
    return [];
  }
}

// Extract RFQ data from OneDrive
export async function seedRFQsFromOneDrive() {
  console.log('📝 Seeding RFQs from OneDrive...');
  
  try {
    const graphClient = await getAppGraphClient();
    
    // List files in RFQ folder (if it exists)
    const rfqFolder = await graphClient
      .api('/drive/root:/PH-Trading-Business/RFQs/:/children')
      .get();
    
    const rfqs = [];
    
    for (const file of rfqFolder.value || []) {
      if (file.name.includes('.xlsx') || file.name.includes('RFQ-')) {
        console.log(`📋 Processing RFQ file: ${file.name}`);
        
        const rfqNumber = extractRFQNumber(file.name);
        
        if (rfqNumber) {
          const rfq = {
            rfq_number: rfqNumber,
            title: extractTitleFromFilename(file.name),
            status: 'completed',
            created_at: file.lastModifiedDateTime || new Date().toISOString(),
            file_reference: file.id
          };
          
          rfqs.push(rfq);
        }
      }
    }
    
    if (rfqs.length > 0) {
      const { data, error } = await supabase
        .from('rfqs')
        .insert(rfqs)
        .select();
      
      if (error) {
        console.error('❌ Error seeding RFQs:', error);
      } else {
        console.log(`✅ Successfully seeded ${rfqs.length} RFQs!`);
      }
    }
    
    return rfqs;
    
  } catch (error) {
    console.error('ℹ️  RFQ folder not found or accessible - skipping RFQ seeding');
    return [];
  }
}

// Helper functions for data extraction
function extractQuotationNumber(filename: string): string | null {
  const matches = filename.match(/QUO-(\d{4}-\d{3})/i) || 
                  filename.match(/QUOTATION[_\s-](\d+)/i) ||
                  filename.match(/(\d{4}-\d{3})/);
  return matches ? matches[1] : null;
}

function extractRFQNumber(filename: string): string | null {
  const matches = filename.match(/RFQ-(\d{4}-\d{3})/i) || 
                  filename.match(/RFQ[_\s-](\d+)/i) ||
                  filename.match(/(\d{4}-\d{3})/);
  return matches ? matches[1] : null;
}

function extractTitleFromFilename(filename: string): string {
  // Remove extension and common prefixes
  let title = filename.replace(/\.(xlsx?|pdf|docx?)$/i, '');
  title = title.replace(/^(QUO|QUOTATION|RFQ)[_\s-]*\d*[_\s-]*/i, '');
  
  // Clean up and capitalize
  title = title.replace(/[_-]/g, ' ').trim();
  return title || 'Imported Document';
}

// Main seeding function
export async function seedAllProductionData() {
  console.log('🚀 Starting complete production data seeding...');
  
  try {
    // Check Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('customers')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Seed data in order
    const customers = await seedCustomersFromOneDrive();
    const quotations = await seedQuotationsFromOneDrive();
    const rfqs = await seedRFQsFromOneDrive();
    
    console.log('\n🎉 Production data seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Quotations: ${quotations.length}`);
    console.log(`   - RFQs: ${rfqs.length}`);
    
    return {
      customers: customers.length,
      quotations: quotations.length,
      rfqs: rfqs.length
    };
    
  } catch (error) {
    console.error('❌ Fatal error in production data seeding:', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  seedAllProductionData()
    .then(() => {
      console.log('✅ Seeding script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding script failed:', error);
      process.exit(1);
    });
}