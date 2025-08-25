'use client';

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';

export default function TestPDFPage() {
  const [generating, setGenerating] = useState(false);

  const generateSamplePDF = async () => {
    setGenerating(true);
    try {
      // Sample quotation data for testing the beautiful new PDF design
      const sampleData = {
        quoteNumber: 'QT-2025-001',
        rfqNumber: 'RFQ-2025-118',
        customer: 'Al Mahmood Construction Company WLL',
        customerEmail: 'procurement@almahmood.bh',
        project: 'Highway Extension Project - Phase 2',
        revision: 1,
        items: [
          {
            description: 'CAT 320 Excavator with Advanced Hydraulic System',
            quantity: 2,
            unit: 'units',
            unitPrice: 125000,
            total: 250000
          },
          {
            description: 'Komatsu D65 Bulldozer with GPS Integration',
            quantity: 1,
            unit: 'unit',
            unitPrice: 185000,
            total: 185000
          },
          {
            description: 'Installation and Commissioning Services',
            quantity: 1,
            unit: 'service',
            unitPrice: 15000,
            total: 15000
          },
          {
            description: 'Extended Warranty Package (24 months)',
            quantity: 3,
            unit: 'units',
            unitPrice: 8500,
            total: 25500
          }
        ],
        subtotal: 475500,
        vat: 47550,
        total: 523050,
        validUntil: '30 days from date of quotation',
        deliveryTerms: 'FOB Manama Port, 6-8 weeks from order confirmation',
        paymentTerms: '30% advance, 40% on delivery, 30% after installation',
        createdAt: new Date().toISOString()
      };

      // Call our enhanced PDF generator
      const response = await fetch('/api/test-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData)
      });

      if (response.ok) {
        // Download the generated PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'PH_Trading_Sample_Quotation.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('✅ Beautiful PDF generated successfully! Check your downloads.');
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Error generating PDF. Check console for details.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              🎨 Enhanced PDF Generator Test
            </h1>
            <p style={{ color: '#6c757d', fontSize: '16px' }}>
              Test our beautiful new PH Trading letterhead-enhanced PDF system
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              ✨ New Features in Enhanced PDF:
            </h3>
            <ul style={{ fontSize: '14px', color: '#495057', lineHeight: '1.8' }}>
              <li><strong>Professional Letterhead:</strong> Beautiful PH Trading branding with Arabic and English names</li>
              <li><strong>Enhanced Colors:</strong> Proper green and gray color scheme matching your letterhead</li>
              <li><strong>Improved Typography:</strong> Better font sizing and professional layout</li>
              <li><strong>Structured Footer:</strong> Three-column contact information layout</li>
              <li><strong>Visual Enhancements:</strong> Subtle backgrounds, borders, and spacing</li>
              <li><strong>Business Details:</strong> Complete contact information, VAT, and CR numbers</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#e7f5ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #74c0fc',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#1864ab' }}>
              🚀 Sample Data Preview:
            </h3>
            <div style={{ fontSize: '13px', color: '#1971c2' }}>
              <p><strong>Customer:</strong> Al Mahmood Construction Company WLL</p>
              <p><strong>Project:</strong> Highway Extension Project - Phase 2</p>
              <p><strong>Total Value:</strong> $523,050 USD (including VAT)</p>
              <p><strong>Items:</strong> CAT 320 Excavator, Komatsu D65 Bulldozer, Services & Warranty</p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={generateSamplePDF}
              disabled={generating}
              style={{
                padding: '15px 40px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: generating ? '#6c757d' : '#7CB342',
                border: 'none',
                borderRadius: '8px',
                cursor: generating ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(124, 179, 66, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!generating) {
                  e.currentTarget.style.backgroundColor = '#8BC34A';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!generating) {
                  e.currentTarget.style.backgroundColor = '#7CB342';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {generating ? '🔄 Generating Beautiful PDF...' : '🎨 Generate Enhanced PDF Sample'}
            </button>
          </div>

          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#d4edda',
            borderRadius: '6px',
            border: '1px solid #c3e6cb'
          }}>
            <p style={{ fontSize: '13px', color: '#155724', margin: '0', textAlign: 'center' }}>
              💡 <strong>Pro Tip:</strong> This enhanced PDF system now matches your beautiful letterhead design 
              and can be used for all quotations, RFQs, and business documents!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}