'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface Quotation {
  id: string;
  quoteNumber: string;
  rfqNumber: string;
  customer: string;
  project: string;
  revision: number;
  items: QuoteItem[];
  subtotal: number;
  markup?: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  deliveryTerms: string;
  paymentTerms: string;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  oemPrice: number;
  markup?: number;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quotations');
      const result = await response.json();
      
      if (result.success) {
        setQuotations(result.data);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/quotations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: quoteId,
          status: newStatus,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchQuotations();
      }
    } catch (error) {
      console.error('Error updating quotation:', error);
    }
  };

  const handleGeneratePDF = async (quoteId: string, quoteNumber: string) => {
    try {
      const response = await fetch(`/api/quotations/${quoteId}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${quoteNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const handleCreateRevision = async (quoteId: string) => {
    const quote = quotations.find(q => q.id === quoteId);
    if (quote && quote.revision >= 3) {
      alert('Maximum 3 revisions allowed per quotation');
      return;
    }

    try {
      const response = await fetch('/api/quotations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: quoteId,
          createRevision: true,
          status: 'draft',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Revision ${result.data.revision} created for ${result.data.quoteNumber}`);
        fetchQuotations();
      } else {
        alert(result.error || 'Failed to create revision');
      }
    } catch (error) {
      console.error('Error creating revision:', error);
      alert('Failed to create revision');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return '#6c757d';
      case 'sent': return '#17a2b8';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'expired': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const calculateMarkupPercentage = (oemPrice: number, sellingPrice: number) => {
    return ((sellingPrice - oemPrice) / oemPrice * 100).toFixed(1);
  };

  const handleCreateOrder = async (quoteId: string) => {
    const poNumber = prompt('Enter PO Number (optional):');
    const expectedDelivery = prompt('Enter Expected Delivery Date (YYYY-MM-DD):');
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          poNumber: poNumber || '',
          expectedDelivery: expectedDelivery || ''
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Order ${result.data.orderNumber} created successfully!`);
        fetchQuotations(); // Refresh to show updated status
        // Redirect to orders page
        window.location.href = '/orders';
      } else {
        alert(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };


  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Loading Quotations...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <MainLayout>
      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Quotations</h1>
        <button
          onClick={() => window.location.href = '/rfq'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Go to RFQs →
        </button>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Active Quotes</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{quotations.length}</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#155724', marginBottom: '5px' }}>Accepted</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
            {quotations.filter(q => q.status === 'accepted').length}
          </p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>Avg Markup</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>20%</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#0c5460', marginBottom: '5px' }}>Total Pipeline</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
            ${quotations.reduce((sum, q) => sum + q.total, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Quotations List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Quotations ({quotations.length})</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Quote #</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>RFQ #</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Project</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Rev</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Items</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Valid Until</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                    No quotations found. Create quotes from RFQs to get started!
                  </td>
                </tr>
              ) : (
                quotations.map((quote) => (
                  <tr key={quote.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{quote.quoteNumber}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{quote.rfqNumber}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{quote.customer}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{quote.project}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <span style={{
                        padding: '2px 6px',
                        backgroundColor: quote.revision > 0 ? '#fff3cd' : '#d4edda',
                        color: quote.revision > 0 ? '#856404' : '#155724',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        Rev {quote.revision}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{quote.items?.length || 0}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                      ${quote.total.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{quote.validUntil}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: getStatusColor(quote.status) + '20',
                          color: getStatusColor(quote.status),
                          border: `1px solid ${getStatusColor(quote.status)}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="draft">DRAFT</option>
                        <option value="sent">SENT</option>
                        <option value="accepted">ACCEPTED</option>
                        <option value="rejected">REJECTED</option>
                        <option value="expired">EXPIRED</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => handleGeneratePDF(quote.id, quote.quoteNumber)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        PDF
                      </button>
                      {quote.status === 'sent' && quote.revision < 3 && (
                        <button 
                          onClick={() => handleCreateRevision(quote.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ffc107',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Revise
                        </button>
                      )}
                      {quote.status === 'accepted' && (
                        <button 
                          onClick={() => handleCreateOrder(quote.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Create Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Analysis */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>💡 Business Logic Active</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Standard Markup</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>20% Applied</p>
            <p style={{ fontSize: '11px', color: '#6c757d' }}>Automatically calculated on OEM prices</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Revision Limit</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffc107' }}>Max 3</p>
            <p style={{ fontSize: '11px', color: '#6c757d' }}>After manager approval</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Quote Validity</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#17a2b8' }}>30 Days</p>
            <p style={{ fontSize: '11px', color: '#6c757d' }}>Auto-calculated from creation</p>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}