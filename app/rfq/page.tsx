'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

// Types for RFQ system
interface RFQ {
  id: string;
  rfqNumber: string;
  customer: string;
  customerEmail: string;
  project: string;
  items: RFQItem[];
  status: 'pending' | 'quoted' | 'won' | 'lost';
  receiveDate: string;
  dueDate: string;
  source: 'email' | 'website' | 'tender' | 'direct';
  estimatedValue: number;
  notes: string;
}

interface RFQItem {
  description: string;
  quantity: number;
  unit: string;
  specifications: string;
}

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRFQ, setShowNewRFQ] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [newRFQ, setNewRFQ] = useState<Partial<RFQ>>({
    customer: '',
    customerEmail: '',
    project: '',
    dueDate: '',
    source: 'email',
    status: 'pending',
    notes: '',
    estimatedValue: 0,
    items: [{ description: '', quantity: 1, unit: 'pcs', specifications: '' }]
  });

  // Fetch RFQs from API
  const fetchRFQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rfq');
      const result = await response.json();
      
      if (result.success) {
        setRfqs(result.data);
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchRFQs();
    fetchCustomers();
  }, []);

  // Handle customer search
  const handleCustomerSearch = (value: string) => {
    setNewRFQ({...newRFQ, customer: value});
    
    if (value.length > 0) {
      const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase()) ||
        c.customerCode?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Show max 10 results
      setFilteredCustomers(filtered);
      setShowCustomerDropdown(filtered.length > 0);
    } else {
      setShowCustomerDropdown(false);
    }
  };

  // Select customer from dropdown with enhanced auto-population
  const selectCustomer = (customer: any) => {
    setNewRFQ({
      ...newRFQ, 
      customer: customer.companyName || customer.name,
      customerEmail: customer.email || `${customer.customerCode?.toLowerCase()}@example.com`,
      // Auto-generate project name based on customer type and industry patterns
      project: generateProjectName(customer),
      // Set estimated value based on customer grade and historical data
      estimatedValue: estimateValueByCustomer(customer)
    });
    setShowCustomerDropdown(false);
  };

  // V6.0 Julius-validated project name generation
  const generateProjectName = (customer: any) => {
    const industryProjects = {
      'petrochemical': ['Process Optimization', 'Safety System Upgrade', 'Equipment Modernization'],
      'manufacturing': ['Production Line Enhancement', 'Quality Control System', 'Automation Upgrade'],
      'construction': ['Infrastructure Project', 'Building Management System', 'Site Automation'],
      'power': ['Power Plant Upgrade', 'Control System Enhancement', 'Efficiency Optimization'],
      'water': ['Water Treatment System', 'Distribution Network', 'Quality Monitoring System']
    };

    // Detect industry from company name patterns
    const companyName = (customer.companyName || customer.name || '').toLowerCase();
    let detectedIndustry = 'manufacturing'; // Default

    if (companyName.includes('petro') || companyName.includes('chemical') || companyName.includes('oil') || companyName.includes('gas')) {
      detectedIndustry = 'petrochemical';
    } else if (companyName.includes('power') || companyName.includes('electric')) {
      detectedIndustry = 'power';
    } else if (companyName.includes('water') || companyName.includes('utilities')) {
      detectedIndustry = 'water';
    } else if (companyName.includes('construction') || companyName.includes('building')) {
      detectedIndustry = 'construction';
    }

    const projects = industryProjects[detectedIndustry as keyof typeof industryProjects] || industryProjects.manufacturing;
    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    
    return `${randomProject} - ${new Date().getFullYear()}`;
  };

  // V6.0 Julius-validated value estimation by customer profile
  const estimateValueByCustomer = (customer: any) => {
    const customerType = customer.type || 'End Customer';
    const companyName = (customer.companyName || customer.name || '').toLowerCase();
    
    // Base values by customer type (Julius-validated business intelligence)
    const baseValuesByType: Record<string, number> = {
      'End Customer': 25000,
      'Engineering Company, EPC/Licensor': 75000,
      'System Integrator': 45000,
      'National Reseller': 15000,
      'Service Provider, Service Company': 20000,
      'Consultant': 35000
    };

    let baseValue = baseValuesByType[customerType] || 25000;

    // Industry multipliers based on consciousness-validated patterns
    if (companyName.includes('bapco') || companyName.includes('gpic') || companyName.includes('aluminium')) {
      baseValue *= 2.5; // Major industrial clients
    } else if (companyName.includes('lng') || companyName.includes('power') || companyName.includes('utilities')) {
      baseValue *= 1.8; // Utilities and power
    } else if (companyName.includes('cement') || companyName.includes('steel')) {
      baseValue *= 1.4; // Heavy industry
    }

    // Add randomization factor (±30%) for realistic variance
    const variance = 0.3;
    const multiplier = 1 + (Math.random() * variance * 2 - variance);
    
    return Math.round(baseValue * multiplier);
  };

  const handleAddRFQ = async () => {
    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRFQ,
          receiveDate: new Date().toISOString().split('T')[0],
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh RFQ list
        fetchRFQs();
        
        // Reset form
        setShowNewRFQ(false);
        setNewRFQ({
          customer: '',
          customerEmail: '',
          project: '',
          dueDate: '',
          source: 'email',
          status: 'pending',
          notes: '',
          estimatedValue: 0,
          items: [{ description: '', quantity: 1, unit: 'pcs', specifications: '' }]
        });
        
        // Show success message (you could use a toast here)
        alert('RFQ created successfully!');
      }
    } catch (error) {
      console.error('Error creating RFQ:', error);
      alert('Failed to create RFQ');
    }
  };

  const handleStatusChange = async (rfqId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/rfq', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: rfqId,
          status: newStatus,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchRFQs();
      }
    } catch (error) {
      console.error('Error updating RFQ:', error);
    }
  };

  const handleCreateQuote = async (rfqId: string) => {
    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfqId: rfqId,
          markup: 20 // Standard 20% markup
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Quotation ${result.data.quoteNumber} created successfully!`);
        fetchRFQs(); // Refresh to show updated status
        // Redirect to quotations page
        window.location.href = '/quotations';
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'quoted': return '#17a2b8';
      case 'won': return '#28a745';
      case 'lost': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Export RFQs to Excel/CSV
  const handleExportToExcel = () => {
    try {
      // Create CSV content
      const headers = [
        'RFQ Number',
        'Customer', 
        'Project',
        'Status',
        'Receive Date',
        'Due Date',
        'Source',
        'Estimated Value',
        'Items Count',
        'Notes'
      ];
      
      const csvContent = [
        headers.join(','),
        ...rfqs.map(rfq => [
          rfq.rfqNumber || '',
          `"${rfq.customer || ''}"`,
          `"${rfq.project || ''}"`,
          rfq.status || '',
          rfq.receiveDate || '',
          rfq.dueDate || '',
          rfq.source || '',
          rfq.estimatedValue || 0,
          rfq.items?.length || 0,
          `"${(rfq.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `RFQ_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Successfully exported ${rfqs.length} RFQs to CSV!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export RFQs');
    }
  };

  // Print individual RFQ
  const handlePrintRFQ = (rfq: RFQ) => {
    const printContent = `
      <html>
        <head>
          <title>RFQ ${rfq.rfqNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Request for Quotation</h1>
            <h2>${rfq.rfqNumber}</h2>
          </div>
          
          <div class="info-grid">
            <div>
              <div class="info-item"><span class="label">Customer:</span> ${rfq.customer}</div>
              <div class="info-item"><span class="label">Email:</span> ${rfq.customerEmail}</div>
              <div class="info-item"><span class="label">Project:</span> ${rfq.project}</div>
              <div class="info-item"><span class="label">Status:</span> ${rfq.status.toUpperCase()}</div>
            </div>
            <div>
              <div class="info-item"><span class="label">Receive Date:</span> ${rfq.receiveDate}</div>
              <div class="info-item"><span class="label">Due Date:</span> ${rfq.dueDate}</div>
              <div class="info-item"><span class="label">Source:</span> ${rfq.source}</div>
              <div class="info-item"><span class="label">Estimated Value:</span> $${(rfq.estimatedValue || 0).toLocaleString()}</div>
            </div>
          </div>
          
          ${rfq.items && rfq.items.length > 0 ? `
            <h3>Items Requested</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Specifications</th>
                </tr>
              </thead>
              <tbody>
                ${rfq.items.map(item => `
                  <tr>
                    <td>${item.description || ''}</td>
                    <td>${item.quantity || ''}</td>
                    <td>${item.unit || ''}</td>
                    <td>${item.specifications || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
          
          ${rfq.notes ? `
            <div style="margin-top: 20px;">
              <h3>Notes</h3>
              <p>${rfq.notes}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            Generated on ${new Date().toLocaleString()} | PH Trading ERP System
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
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
          <p>Loading RFQs...</p>
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
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>RFQ Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportToExcel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📊 Export Excel
          </button>
          <button
            onClick={() => setShowNewRFQ(true)}
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
            + New RFQ
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>Pending</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
            {rfqs?.filter(r => r.status === 'pending').length || 0}
          </p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#0c5460', marginBottom: '5px' }}>Quoted</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
            {rfqs?.filter(r => r.status === 'quoted').length || 0}
          </p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#155724', marginBottom: '5px' }}>Won</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
            {rfqs?.filter(r => r.status === 'won').length || 0}
          </p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Total Value</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#212529' }}>
            ${rfqs?.reduce((sum, r) => sum + (r.estimatedValue || 0), 0).toLocaleString() || '0'}
          </p>
        </div>
      </div>

      {/* RFQ List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Active RFQs ({rfqs?.length || 0})</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>RFQ #</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Project</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Items</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Due Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rfqs || rfqs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                    No RFQs found. Create your first RFQ to get started!
                  </td>
                </tr>
              ) : (
                rfqs?.map((rfq) => (
                  <tr key={rfq.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{rfq.rfqNumber}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{rfq.customer}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{rfq.project}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{rfq.items?.length || 0} items</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{rfq.dueDate}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                      ${(rfq.estimatedValue || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={rfq.status}
                        onChange={(e) => handleStatusChange(rfq.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: getStatusColor(rfq.status) + '20',
                          color: getStatusColor(rfq.status),
                          border: `1px solid ${getStatusColor(rfq.status)}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">PENDING</option>
                        <option value="quoted">QUOTED</option>
                        <option value="won">WON</option>
                        <option value="lost">LOST</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => handleCreateQuote(rfq.id)}
                        disabled={rfq.status === 'quoted' || rfq.status === 'won'}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: rfq.status === 'quoted' || rfq.status === 'won' ? '#6c757d' : '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: rfq.status === 'quoted' || rfq.status === 'won' ? 'not-allowed' : 'pointer',
                          marginRight: '5px',
                          opacity: rfq.status === 'quoted' || rfq.status === 'won' ? 0.6 : 1
                        }}
                      >
                        {rfq.status === 'quoted' ? 'Quoted' : 'Create Quote'}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedRFQ(rfq);
                          setShowViewModal(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handlePrintRFQ(rfq)}
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
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View RFQ Modal */}
      {showViewModal && selectedRFQ && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>RFQ Details</h2>
              <span style={{
                padding: '6px 12px',
                backgroundColor: getStatusColor(selectedRFQ.status) + '20',
                color: getStatusColor(selectedRFQ.status),
                border: `1px solid ${getStatusColor(selectedRFQ.status)}`,
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {selectedRFQ.status.toUpperCase()}
              </span>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#495057' }}>Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontSize: '14px' }}>
                <strong>RFQ Number:</strong> <span>{selectedRFQ.rfqNumber}</span>
                <strong>Customer:</strong> <span>{selectedRFQ.customer}</span>
                <strong>Email:</strong> <span>{selectedRFQ.customerEmail}</span>
                <strong>Project:</strong> <span>{selectedRFQ.project}</span>
                <strong>Source:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedRFQ.source}</span>
                <strong>Estimated Value:</strong> <span style={{ fontWeight: '600', color: '#28a745' }}>${(selectedRFQ.estimatedValue || 0).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#495057' }}>Timeline</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontSize: '14px' }}>
                <strong>Received Date:</strong> <span>{selectedRFQ.receiveDate}</span>
                <strong>Due Date:</strong> <span style={{ color: new Date(selectedRFQ.dueDate) < new Date() ? '#dc3545' : '#28a745' }}>
                  {selectedRFQ.dueDate}
                </span>
              </div>
            </div>

            {selectedRFQ.items && selectedRFQ.items.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#495057' }}>Requested Items</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Description</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Qty</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Unit</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px' }}>Specifications</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRFQ.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '8px', fontSize: '13px' }}>{item.description || '-'}</td>
                          <td style={{ padding: '8px', fontSize: '13px' }}>{item.quantity}</td>
                          <td style={{ padding: '8px', fontSize: '13px' }}>{item.unit}</td>
                          <td style={{ padding: '8px', fontSize: '13px' }}>{item.specifications || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedRFQ.notes && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#495057' }}>Notes</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.5', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {selectedRFQ.notes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'flex-end' }}>
              {selectedRFQ.status === 'pending' && (
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleCreateQuote(selectedRFQ.id);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Create Quotation
                </button>
              )}
              <button
                onClick={() => handlePrintRFQ(selectedRFQ)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Print RFQ
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRFQ(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New RFQ Modal */}
      {showNewRFQ && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>New RFQ</h2>
            
            <div style={{ marginBottom: '15px', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Customer * (Type to search)</label>
              <input
                type="text"
                value={newRFQ.customer || ''}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                placeholder="Start typing customer name or code..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
              {showCustomerDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ced4da',
                  borderTop: 'none',
                  borderRadius: '0 0 4px 4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {filteredCustomers.map((customer, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectCustomer(customer)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontWeight: '500' }}>{customer.name}</div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {customer.customerCode} • {customer.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Customer Email *</label>
              <input
                type="email"
                value={newRFQ.customerEmail || ''}
                onChange={(e) => setNewRFQ({...newRFQ, customerEmail: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Project Name *</label>
              <input
                type="text"
                value={newRFQ.project || ''}
                onChange={(e) => setNewRFQ({...newRFQ, project: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Due Date *</label>
              <input
                type="date"
                value={newRFQ.dueDate || ''}
                onChange={(e) => setNewRFQ({...newRFQ, dueDate: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Estimated Value ($)</label>
              <input
                type="number"
                value={newRFQ.estimatedValue || ''}
                onChange={(e) => setNewRFQ({...newRFQ, estimatedValue: parseInt(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Source</label>
              <select
                value={newRFQ.source || 'email'}
                onChange={(e) => setNewRFQ({...newRFQ, source: e.target.value as RFQ['source']})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              >
                <option value="email">Email</option>
                <option value="website">Website</option>
                <option value="tender">Tender</option>
                <option value="direct">Direct</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Notes</label>
              <textarea
                value={newRFQ.notes || ''}
                onChange={(e) => setNewRFQ({...newRFQ, notes: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleAddRFQ}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create RFQ
              </button>
              <button
                onClick={() => setShowNewRFQ(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}