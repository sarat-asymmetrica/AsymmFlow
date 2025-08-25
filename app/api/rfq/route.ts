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
    // If file doesn't exist, create it with empty structure
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

// GET /api/rfq - Get all RFQs
export async function GET(request: NextRequest) {
  try {
    const db = await readDB();
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const customer = searchParams.get('customer');
    
    let rfqs = db.rfqs || [];
    
    // Apply filters
    if (status) {
      rfqs = rfqs.filter((rfq: any) => rfq.status === status);
    }
    if (customer) {
      rfqs = rfqs.filter((rfq: any) => 
        rfq.customer.toLowerCase().includes(customer.toLowerCase())
      );
    }
    
    return NextResponse.json({
      success: true,
      data: rfqs,
      count: rfqs.length
    });
  } catch (error) {
    console.error('Error fetching RFQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RFQs' },
      { status: 500 }
    );
  }
}

// POST /api/rfq - Create new RFQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await readDB();
    
    // Generate RFQ number
    const year = new Date().getFullYear();
    const count = (db.rfqs?.length || 0) + 1;
    const rfqNumber = `RFQ-${year}-${String(count).padStart(3, '0')}`;
    
    // Create new RFQ
    const newRFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber,
      ...body,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to database
    db.rfqs = db.rfqs || [];
    db.rfqs.push(newRFQ);
    
    await writeDB(db);
    
    return NextResponse.json({
      success: true,
      data: newRFQ,
      message: 'RFQ created successfully'
    });
  } catch (error) {
    console.error('Error creating RFQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create RFQ' },
      { status: 500 }
    );
  }
}

// PUT /api/rfq - Update RFQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RFQ ID is required' },
        { status: 400 }
      );
    }
    
    const db = await readDB();
    const rfqIndex = db.rfqs?.findIndex((rfq: any) => rfq.id === id);
    
    if (rfqIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'RFQ not found' },
        { status: 404 }
      );
    }
    
    // Update RFQ
    db.rfqs[rfqIndex] = {
      ...db.rfqs[rfqIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await writeDB(db);
    
    return NextResponse.json({
      success: true,
      data: db.rfqs[rfqIndex],
      message: 'RFQ updated successfully'
    });
  } catch (error) {
    console.error('Error updating RFQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update RFQ' },
      { status: 500 }
    );
  }
}

// DELETE /api/rfq - Delete RFQ
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RFQ ID is required' },
        { status: 400 }
      );
    }
    
    const db = await readDB();
    const rfqIndex = db.rfqs?.findIndex((rfq: any) => rfq.id === id);
    
    if (rfqIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'RFQ not found' },
        { status: 404 }
      );
    }
    
    // Remove RFQ
    db.rfqs.splice(rfqIndex, 1);
    await writeDB(db);
    
    return NextResponse.json({
      success: true,
      message: 'RFQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting RFQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete RFQ' },
      { status: 500 }
    );
  }
}