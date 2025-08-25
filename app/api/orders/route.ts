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

// Helper to write database
async function writeDB(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const db = await readDB();
    return NextResponse.json({
      success: true,
      data: db.orders || []
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order from quotation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, poNumber, expectedDelivery } = body;

    const db = await readDB();
    
    // Find the quotation
    const quote = db.quotations?.find((q: any) => q.id === quoteId);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Generate order number
    const year = new Date().getFullYear();
    const existingOrders = db.orders?.filter((o: any) => 
      o.orderNumber?.startsWith(`ORD-${year}-`)
    ) || [];
    const count = existingOrders.length + 1;
    const orderNumber = `ORD-${year}-${String(count).padStart(3, '0')}`;

    // Create the order
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      poNumber: poNumber || '',
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
      rfqNumber: quote.rfqNumber,
      customer: quote.customer,
      customerEmail: quote.customerEmail,
      project: quote.project,
      items: quote.items,
      totalValue: quote.total,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: expectedDelivery || '',
      actualDelivery: null,
      status: 'pending',
      oemOrderRef: '',
      paymentStatus: 'pending',
      documents: {
        rfq: true,
        quotation: true,
        po: !!poNumber,
        deliveryConfirmation: false,
        customsDocs: false,
        deliveryNote: false
      },
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to database
    if (!db.orders) db.orders = [];
    db.orders.push(newOrder);

    // Update quotation status to 'accepted' if not already
    const quoteIndex = db.quotations.findIndex((q: any) => q.id === quoteId);
    if (quoteIndex !== -1 && db.quotations[quoteIndex].status !== 'accepted') {
      db.quotations[quoteIndex].status = 'accepted';
      db.quotations[quoteIndex].updatedAt = new Date().toISOString();
    }

    // Update RFQ status to 'won' if not already
    const rfqIndex = db.rfqs?.findIndex((r: any) => r.id === quote.rfqId);
    if (rfqIndex !== -1 && db.rfqs[rfqIndex].status !== 'won') {
      db.rfqs[rfqIndex].status = 'won';
      db.rfqs[rfqIndex].updatedAt = new Date().toISOString();
    }

    await writeDB(db);

    return NextResponse.json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const db = await readDB();
    const orderIndex = db.orders?.findIndex((o: any) => o.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update the order
    db.orders[orderIndex] = {
      ...db.orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If updating document status, check if all 6 mandatory docs are complete
    if (updates.documents) {
      const docs = db.orders[orderIndex].documents;
      const allDocsComplete = docs.rfq && docs.quotation && docs.po && 
                              docs.deliveryConfirmation && docs.customsDocs && docs.deliveryNote;
      
      if (allDocsComplete && db.orders[orderIndex].status !== 'delivered') {
        db.orders[orderIndex].status = 'delivered';
      }
    }

    await writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders - Delete order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID required' },
        { status: 400 }
      );
    }

    const db = await readDB();
    const orderIndex = db.orders?.findIndex((o: any) => o.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Remove the order
    db.orders.splice(orderIndex, 1);
    await writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}