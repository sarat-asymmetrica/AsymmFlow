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

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    const db = await readDB();
    
    // Sort customers by name
    const customers = (db.customers || []).sort((a: any, b: any) => 
      a.name.localeCompare(b.name)
    );
    
    return NextResponse.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, type, address, country } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Name and type are required fields' },
        { status: 400 }
      );
    }

    const db = await readDB();
    
    // Generate customer code based on type
    const typeCodeMap: any = {
      'Consultant': 'CO',
      'End Customer': 'EC',
      'Engineering Company/EPC': 'EP',
      'International Reseller': 'IR',
      'Machine Builder': 'MB',
      'National Reseller': 'NR',
      'Plant Builder': 'PB',
      'System Integrator': 'SI',
      'Service Provider': 'SP'
    };
    
    const typeCode = typeCodeMap[type] || 'EC';
    
    // Find the next serial number for this type
    const sameTypeCustomers = db.customers?.filter((c: any) => 
      c.customerCode?.startsWith(typeCode)
    ) || [];
    
    const maxSerial = sameTypeCustomers.reduce((max: number, c: any) => {
      const match = c.customerCode?.match(/\d+$/);
      const serial = match ? parseInt(match[0]) : 0;
      return Math.max(max, serial);
    }, 0);
    
    const customerCode = `${typeCode}${maxSerial + 1}`;
    
    // Create the customer
    const newCustomer = {
      id: `cust-${customerCode}`,
      name: name,
      shortName: name.substring(0, 20),
      customerCode: customerCode,
      type: type,
      typeCode: typeCode,
      email: email || '',
      phone: phone || '',
      address: address || '',
      country: country || 'Bahrain',
      totalOrders: 0,
      totalRevenue: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to database
    if (!db.customers) db.customers = [];
    db.customers.push(newCustomer);
    
    await writeDB(db);

    return NextResponse.json({
      success: true,
      data: newCustomer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers - Update customer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const db = await readDB();
    const customerIndex = db.customers?.findIndex((c: any) => c.id === id);
    
    if (customerIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Update the customer
    db.customers[customerIndex] = {
      ...db.customers[customerIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.customers[customerIndex]
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers - Delete customer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const db = await readDB();
    const customerIndex = db.customers?.findIndex((c: any) => c.id === id);
    
    if (customerIndex === -1 || !db.customers) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Remove the customer
    const deletedCustomer = db.customers.splice(customerIndex, 1)[0];
    
    await writeDB(db);

    return NextResponse.json({
      success: true,
      data: deletedCustomer,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}