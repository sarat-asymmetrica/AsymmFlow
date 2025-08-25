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

// GET /api/rfq/[id] - Get single RFQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await readDB();
    const rfq = db.rfqs?.find((r: any) => r.id === id);
    
    if (!rfq) {
      return NextResponse.json(
        { success: false, error: 'RFQ not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: rfq
    });
  } catch (error) {
    console.error('Error fetching RFQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RFQ' },
      { status: 500 }
    );
  }
}