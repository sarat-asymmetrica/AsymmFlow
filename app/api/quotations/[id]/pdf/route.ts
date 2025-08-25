import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateQuotationPDF, generateQuotationFilename } from '../../../../../lib/pdf-generator';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { rfqs: [], quotations: [], orders: [], customers: [], oems: [] };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await readDB();
    const quotation = db.quotations?.find((q: any) => q.id === id);
    
    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }
    
    // Calculate VAT (10% as per Bahrain standard)
    const vatAmount = quotation.subtotal * 0.1;
    
    // Prepare data for PDF
    const pdfData = {
      quoteNumber: quotation.quoteNumber,
      rfqNumber: quotation.rfqNumber,
      customer: quotation.customer,
      customerEmail: quotation.customerEmail,
      project: quotation.project,
      revision: quotation.revision,
      items: quotation.items,
      subtotal: quotation.subtotal,
      vat: vatAmount,
      total: quotation.total,
      validUntil: quotation.validUntil,
      deliveryTerms: quotation.deliveryTerms,
      paymentTerms: quotation.paymentTerms,
      createdAt: quotation.createdAt
    };
    
    // Generate PDF
    const doc = generateQuotationPDF(pdfData);
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const filename = generateQuotationFilename(quotation.quoteNumber);
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}