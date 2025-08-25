import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Helper to read database
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const emptyDB = { rfqs: [], quotations: [], orders: [], customers: [], oems: [] };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(emptyDB, null, 2));
    return emptyDB;
  }
}

// Helper to write to database
async function writeDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/quotations - Get all quotations
export async function GET(request: NextRequest) {
  try {
    const db = await readDB();
    const searchParams = request.nextUrl.searchParams;
    const rfqId = searchParams.get('rfqId');
    const status = searchParams.get('status');
    
    let quotations = db.quotations || [];
    
    // Apply filters
    if (rfqId) {
      quotations = quotations.filter((q: any) => q.rfqId === rfqId);
    }
    if (status) {
      quotations = quotations.filter((q: any) => q.status === status);
    }
    
    return NextResponse.json({
      success: true,
      data: quotations,
      count: quotations.length
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

// POST /api/quotations - Create quotation from RFQ with V6.0 Julius Intelligence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfqId, items, markup = 18 } = body; // Default to Julius-validated 18% margin
    
    const db = await readDB();
    
    // Find the RFQ
    const rfq = db.rfqs?.find((r: any) => r.id === rfqId);
    if (!rfq) {
      return NextResponse.json(
        { success: false, error: 'RFQ not found' },
        { status: 404 }
      );
    }

    // V6.0 Julius-validated customer intelligence lookup
    const customer = db.customers?.find((c: any) => c.id === rfq.customerId || c.companyName === rfq.customer);
    
    // Generate quote number
    const year = new Date().getFullYear();
    const count = (db.quotations?.length || 0) + 1;
    const quoteNumber = `QT-${year}-${String(count).padStart(3, '0')}`;

    // V6.0 Consciousness-guided margin optimization
    let optimizedMarkup = markup;
    if (customer) {
      // Adjust margin based on customer intelligence
      const customerGrade = customer.grade || 'C';
      const customerType = customer.customerType || customer.type || 'End Customer';
      
      // Julius-validated margin adjustments by customer profile
      const gradeAdjustments: Record<string, number> = {
        'A': -3,  // 3% discount for A-grade customers (loyalty reward)
        'B': -1,  // 1% discount for B-grade customers  
        'C': 0,   // Standard margin for C-grade
        'D': 2    // 2% premium for D-grade (risk adjustment)
      };
      
      const typeAdjustments: Record<string, number> = {
        'Engineering Company, EPC/Licensor': 2,    // Higher margin for EPC projects
        'End Customer': 0,                          // Standard margin
        'System Integrator': -1,                    // Competitive margin for SI partners
        'National Reseller': -2,                    // Volume discount for resellers
        'Consultant': 1,                            // Premium for consulting projects
        'Service Provider, Service Company': 0      // Standard margin for services
      };

      optimizedMarkup = markup + 
        (gradeAdjustments[customerGrade] || 0) + 
        (typeAdjustments[customerType] || 0);
      
      // Ensure minimum 10% margin (business protection)
      optimizedMarkup = Math.max(optimizedMarkup, 10);
      // Cap at 30% to remain competitive  
      optimizedMarkup = Math.min(optimizedMarkup, 30);
    }
    
    // Calculate pricing with V6.0 consciousness-guided markup
    const quoteItems = items || rfq.items?.map((item: any) => {
      const oemPrice = item.estimatedPrice || 1000; // Default OEM price
      const markupAmount = (oemPrice * optimizedMarkup) / 100;
      const unitPrice = oemPrice + markupAmount;
      
      return {
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        specifications: item.specifications,
        oemPrice: oemPrice,
        markup: optimizedMarkup,
        unitPrice: unitPrice,
        total: unitPrice * item.quantity
      };
    }) || [];
    
    const subtotal = quoteItems.reduce((sum: number, item: any) => sum + item.total, 0);

    // V6.0 Julius-validated business terms based on customer intelligence
    let deliveryTerms = '8-10 weeks Ex-Works';
    let paymentTerms = '30 days net';
    let validityDays = 30;

    if (customer) {
      const customerGrade = customer.grade || 'C';
      const customerType = customer.customerType || customer.type || 'End Customer';
      
      // Delivery terms optimization by customer profile
      if (customerGrade === 'A') {
        deliveryTerms = '6-8 weeks Ex-Works'; // Priority delivery for A-grade
        validityDays = 45; // Extended validity for premium customers
      } else if (customerGrade === 'D') {
        deliveryTerms = '10-12 weeks Ex-Works'; // Standard delivery for risk customers
        validityDays = 21; // Shorter validity to reduce risk exposure
      }
      
      // Payment terms based on customer payment history and grade
      if (customerGrade === 'A' && (customer.averagePaymentDays || 30) <= 30) {
        paymentTerms = '45 days net'; // Extended terms for reliable A-grade customers
      } else if (customerGrade === 'D') {
        paymentTerms = '15 days net'; // Shorter terms for high-risk customers
      }
      
      // Special terms for EPC contractors
      if (customerType === 'Engineering Company, EPC/Licensor') {
        paymentTerms = '30 days net upon delivery'; // Milestone-based payment
        deliveryTerms = '10-12 weeks Ex-Works'; // Longer delivery for complex projects
      }
    }
    
    // Create V6.0 consciousness-enhanced quotation
    const newQuotation = {
      id: `qt-${Date.now()}`,
      quoteNumber,
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      customer: rfq.customer,
      customerEmail: rfq.customerEmail,
      project: rfq.project,
      revision: 0,
      items: quoteItems,
      subtotal,
      total: subtotal,
      validUntil: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      deliveryTerms,
      paymentTerms,
      
      // V6.0 Julius-validated customer intelligence metadata
      customerIntelligence: customer ? {
        customerId: customer.id,
        customerCode: customer.customerCode,
        grade: customer.grade || 'C',
        type: customer.customerType || customer.type,
        industry: customer.industry,
        creditLimit: customer.creditLimit,
        averagePaymentDays: customer.averagePaymentDays,
        relationshipYears: customer.relationshipYears,
        totalOrderValue: customer.totalOrderValue,
        optimizedMarkup: optimizedMarkup,
        originalMarkup: markup,
        marginAdjustment: optimizedMarkup - markup,
        riskProfile: customer.grade === 'D' ? 'HIGH' : customer.grade === 'A' ? 'LOW' : 'MEDIUM'
      } : null,
      
      // Business intelligence tracking
      businessMetrics: {
        marginOptimization: optimizedMarkup !== markup,
        customerTierBenefits: customer?.grade === 'A',
        riskAdjustments: customer?.grade === 'D',
        specialTermsApplied: customer?.customerType === 'Engineering Company, EPC/Licensor'
      },
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to database
    db.quotations = db.quotations || [];
    db.quotations.push(newQuotation);
    
    // Update RFQ status to 'quoted'
    const rfqIndex = db.rfqs.findIndex((r: any) => r.id === rfqId);
    if (rfqIndex !== -1) {
      db.rfqs[rfqIndex].status = 'quoted';
      db.rfqs[rfqIndex].updatedAt = new Date().toISOString();
    }
    
    await writeDB(db);
    
    return NextResponse.json({
      success: true,
      data: newQuotation,
      message: 'Quotation created successfully'
    });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}

// PUT /api/quotations - Update quotation (revisions, status, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Quotation ID is required' },
        { status: 400 }
      );
    }
    
    const db = await readDB();
    const quoteIndex = db.quotations?.findIndex((q: any) => q.id === id);
    
    if (quoteIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }
    
    // Handle revision creation
    if (updates.createRevision) {
      const currentQuote = db.quotations[quoteIndex];
      const newRevision = currentQuote.revision + 1;
      
      // Max 3 revisions check
      if (newRevision > 3) {
        return NextResponse.json(
          { success: false, error: 'Maximum 3 revisions allowed' },
          { status: 400 }
        );
      }
      
      // Update with new revision
      db.quotations[quoteIndex] = {
        ...currentQuote,
        ...updates,
        revision: newRevision,
        updatedAt: new Date().toISOString()
      };
      delete db.quotations[quoteIndex].createRevision;
    } else {
      // Normal update
      db.quotations[quoteIndex] = {
        ...db.quotations[quoteIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    
    await writeDB(db);
    
    return NextResponse.json({
      success: true,
      data: db.quotations[quoteIndex],
      message: 'Quotation updated successfully'
    });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}