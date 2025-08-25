import jsPDF from 'jspdf';

// Enhanced PDF Generator with Professional PH Trading Branding
// Integrated with Canva-designed templates and beautiful letterhead

interface QuotationData {
  quoteNumber: string;
  rfqNumber: string;
  customer: string;
  customerEmail?: string;
  project: string;
  revision: number;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  vat?: number;
  total: number;
  validUntil: string;
  deliveryTerms: string;
  paymentTerms: string;
  createdAt: string;
}

export function generateQuotationPDF(data: QuotationData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Professional PH Trading Brand Colors (from letterhead analysis)
  const phGreen = '#7CB342'; // Beautiful green from PH logo
  const phGray = '#424242'; // Professional gray from letterhead
  const textColor = '#212121'; // Crisp text color
  const lightGray = '#F5F5F5'; // Subtle background
  const accentGray = '#9E9E9E'; // Secondary text color
  
  // Enhanced Professional Header with Original Letterhead Inspiration
  // Clean white background like original
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Subtle border line at top (inspired by original)
  doc.setDrawColor(phGreen);
  doc.setLineWidth(1);
  doc.line(0, 2, pageWidth, 2);
  
  // Professional letterhead-style header box (cleaner like original)
  doc.setFillColor(252, 252, 252);
  doc.rect(15, 8, pageWidth - 30, 32, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.rect(15, 8, pageWidth - 30, 32, 'S');
  
  // Subtle PH watermark background (inspired by original letterhead design)
  doc.setTextColor(248, 248, 248); // Ultra-light gray watermark (more subtle)
  doc.setFontSize(100);
  doc.setFont('helvetica', 'bold');
  // Position watermark in lower right area, rotated slightly for elegance
  const watermarkX = pageWidth - 80;
  const watermarkY = pageHeight - 60;
  doc.text('PH', watermarkX, watermarkY, { angle: -15 });
  
  // Reset for header content (positioned within the clean header box)
  doc.setTextColor(phGreen);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('PH', 22, 28);
  
  doc.setFontSize(15);
  doc.setTextColor(phGray);
  doc.setFont('helvetica', 'normal');
  doc.text('TRADING W.L.L.', 45, 28);
  
  // Arabic company name (simplified to avoid encoding issues)
  doc.setFontSize(9);
  doc.setTextColor(accentGray);
  doc.setFont('helvetica', 'normal');
  doc.text('شركة بي اتش التجارية ذ.م.م', 22, 35);
  
  // Professional taglines (positioned in header box)
  doc.setFontSize(8);
  doc.setTextColor(accentGray);
  doc.setFont('helvetica', 'italic');
  doc.text('Excellence in Industrial Equipment Trading', pageWidth - 22, 20, { align: 'right' });
  doc.text('Your Trusted Partner Since 2010', pageWidth - 22, 28, { align: 'right' });
  
  // Quotation Title (better positioned after cleaner header)
  doc.setFontSize(20);
  doc.setTextColor(phGray);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth / 2, 58, { align: 'center' });
  
  // Quote details box with better alignment (adjusted for new header)
  const detailsY = 70;
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  
  // Left side details with proper alignment
  doc.setFont('helvetica', 'bold');
  doc.text('Quote Number:', 20, detailsY);
  doc.text('RFQ Number:', 20, detailsY + 7);
  doc.text('Date:', 20, detailsY + 14);
  doc.text('Valid Until:', 20, detailsY + 21);
  
  doc.setFont('helvetica', 'normal');
  doc.text(data.quoteNumber, 65, detailsY);
  doc.text(data.rfqNumber, 65, detailsY + 7);
  doc.text(new Date(data.createdAt).toLocaleDateString(), 65, detailsY + 14);
  doc.text(data.validUntil, 65, detailsY + 21);
  
  // Right side - Customer details with better alignment
  doc.setFont('helvetica', 'bold');
  doc.text('Customer:', 110, detailsY);
  doc.text('Project:', 110, detailsY + 7);
  doc.text('Email:', 110, detailsY + 14);
  doc.text('Revision:', 110, detailsY + 21);
  
  doc.setFont('helvetica', 'normal');
  const customerName = data.customer.length > 25 
    ? data.customer.substring(0, 25) + '...' 
    : data.customer;
  doc.text(customerName, 135, detailsY);
  const projectName = data.project.length > 25 
    ? data.project.substring(0, 25) + '...' 
    : data.project;
  doc.text(projectName, 135, detailsY + 7);
  doc.text(data.customerEmail || '-', 135, detailsY + 14);
  doc.text(`Rev ${data.revision}`, 135, detailsY + 21);
  
  // Items table
  const tableY = detailsY + 35;
  
  // Enhanced table header with gradient effect
  doc.setFillColor(phGreen);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, tableY, pageWidth - 40, 10, 'F');
  
  // Subtle header accent
  doc.setFillColor(phGray);
  doc.rect(20, tableY, pageWidth - 40, 2, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('No.', 25, tableY + 6.5);
  doc.text('Description', 40, tableY + 6.5);
  doc.text('Qty', 110, tableY + 6.5);
  doc.text('Unit', 125, tableY + 6.5);
  doc.text('Unit Price (USD)', 140, tableY + 6.5);
  doc.text('Total (USD)', 170, tableY + 6.5);
  
  // Table rows
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  let currentY = tableY + 10;
  data.items.forEach((item, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, currentY, pageWidth - 40, 7, 'F');
    }
    
    doc.text(`${index + 1}`, 25, currentY + 5);
    
    // Truncate long descriptions
    const desc = item.description?.length > 40 
      ? item.description.substring(0, 40) + '...' 
      : item.description || '';
    doc.text(desc, 40, currentY + 5);
    
    doc.text(`${item.quantity || 0}`, 110, currentY + 5);
    doc.text(item.unit || 'Unit', 125, currentY + 5);
    
    // Safe handling for prices with fallback calculations
    const unitPrice = item.unitPrice || (item as any).price || 0;
    const quantity = item.quantity || 1;
    const total = item.total || (unitPrice * quantity);
    
    doc.text(`$${unitPrice.toLocaleString()}`, 140, currentY + 5);
    doc.text(`$${total.toLocaleString()}`, 170, currentY + 5);
    
    currentY += 7;
  });
  
  // Draw bottom line of table
  doc.setDrawColor(200, 200, 200);
  doc.line(20, currentY, pageWidth - 20, currentY);
  
  // Totals section
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  
  // Subtotal
  doc.text('Subtotal:', 140, currentY);
  doc.text(`$${data.subtotal.toLocaleString()}`, 170, currentY);
  
  // VAT if applicable
  if (data.vat) {
    currentY += 7;
    doc.text('VAT (10%):', 140, currentY);
    doc.text(`$${data.vat.toLocaleString()}`, 170, currentY);
  }
  
  // Enhanced Total with professional styling
  currentY += 10;
  doc.setFontSize(12);
  doc.setFillColor(phGreen);
  doc.setTextColor(255, 255, 255);
  doc.rect(130, currentY - 6, 65, 12, 'F');
  
  // Subtle shadow effect
  doc.setFillColor(200, 200, 200);
  doc.rect(132, currentY - 4, 65, 12, 'F');
  doc.setFillColor(phGreen);
  doc.rect(130, currentY - 6, 65, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL USD:', 135, currentY);
  doc.text(`$${data.total.toLocaleString()}`, 175, currentY, { align: 'right' });
  
  // Terms section
  currentY += 20;
  doc.setTextColor(textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 20, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  currentY += 7;
  doc.text(`• Delivery Terms: ${data.deliveryTerms}`, 25, currentY);
  currentY += 5;
  doc.text(`• Payment Terms: ${data.paymentTerms}`, 25, currentY);
  currentY += 5;
  doc.text('• Prices are subject to change without prior notice', 25, currentY);
  currentY += 5;
  doc.text('• This quotation is valid for the period mentioned above', 25, currentY);
  
  // Enhanced Professional Footer (matching letterhead style)
  const footerY = pageHeight - 35;
  
  // Footer background with subtle gradient
  doc.setFillColor(248, 248, 248);
  doc.rect(0, footerY - 10, pageWidth, 45, 'F');
  
  // Professional separator line
  doc.setDrawColor(phGreen);
  doc.setLineWidth(1);
  doc.line(20, footerY - 8, pageWidth - 20, footerY - 8);
  
  // Company contact information in professional layout
  doc.setFontSize(9);
  doc.setTextColor(phGray);
  doc.setFont('helvetica', 'bold');
  
  // Left side - Address
  doc.text('HEAD OFFICE:', 25, footerY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('P.O. Box 815, Manama', 25, footerY + 5);
  doc.text('Kingdom of Bahrain', 25, footerY + 10);
  
  // Center - Communication
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONTACT:', pageWidth / 2 - 20, footerY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Tel: +973 17 587654', pageWidth / 2 - 20, footerY + 5);
  doc.text('Fax: +973 17 564456', pageWidth / 2 - 20, footerY + 10);
  
  // Right side - Registration
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('REGISTRATION:', pageWidth - 70, footerY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('VAT: 200010357800002', pageWidth - 70, footerY + 5);
  doc.text('CR: 68034-1', pageWidth - 70, footerY + 10);
  
  // Professional disclaimer
  doc.setFontSize(7);
  doc.setTextColor(accentGray);
  doc.setFont('helvetica', 'italic');
  doc.text('This document is generated electronically and does not require a signature for validity.', pageWidth / 2, footerY + 18, { align: 'center' });
  
  // Signature section
  if (currentY < footerY - 40) {
    const signatureY = footerY - 35;
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.text('For PH Trading W.L.L.', 20, signatureY);
    doc.line(20, signatureY + 15, 70, signatureY + 15);
    doc.setFontSize(9);
    doc.text('Authorized Signature', 20, signatureY + 20);
  }
  
  return doc;
}

export function generateQuotationFilename(quoteNumber: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${quoteNumber}_${date}.pdf`;
}