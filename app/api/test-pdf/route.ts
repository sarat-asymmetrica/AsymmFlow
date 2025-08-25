import { NextRequest, NextResponse } from 'next/server';
import { generateQuotationPDF } from '../../../lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate the enhanced PDF with beautiful letterhead
    const pdf = generateQuotationPDF(data);
    
    // Convert to buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="PH_Trading_Enhanced_Quotation.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}