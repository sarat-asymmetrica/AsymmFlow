'use client';

import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import ErrorBoundary from '../../src/components/ui/ErrorBoundary';
import { ToastProvider, useToast } from '../../src/components/ui/ToastSystem';

interface Customer {
  id: string;
  name: string;
  customerCode: string;
  type: string;
  typeCode: string;
  email: string;
  phone: string;
  country: string;
  status: string;
}

// Separate component to use hooks inside provider
function CustomersContent() {
  const { showSuccess, showError, showWarning } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Contractor',
    country: 'Bahrain'
  });
  const [editCustomer, setEditCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    country: ''
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/customers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data || []);
        if (result.data?.length === 0) {
          showWarning('No customers found', 'Start by adding your first customer to get started.');
        }
      } else {
        throw new Error(result.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      showError('Failed to load customers', errorMessage);
      setCustomers([]); // Ensure customers is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) {
      showError('Validation Error', 'Customer name is required');
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCustomer,
          name: newCustomer.name.trim(),
          customerCode: `CUS-${Date.now().toString().slice(-6)}`,
          typeCode: newCustomer.type.toLowerCase(),
          status: 'Active'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchCustomers();
        setShowAddModal(false);
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          type: 'Contractor',
          country: 'Bahrain'
        });
        showSuccess('Customer Added', `${newCustomer.name} has been successfully added to your customer database.`);
      } else {
        throw new Error(result.message || 'Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showError('Failed to add customer', errorMessage);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      type: customer.type,
      country: customer.country
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    
    if (!editCustomer.name.trim()) {
      showError('Validation Error', 'Customer name is required');
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedCustomer.id,
          ...editCustomer,
          name: editCustomer.name.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchCustomers();
        setShowEditModal(false);
        setSelectedCustomer(null);
        showSuccess('Customer Updated', `${editCustomer.name} has been successfully updated.`);
      } else {
        throw new Error(result.message || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showError('Failed to update customer', errorMessage);
    }
  };

  // Multi-country phone validation
  const validatePhone = (phone: string): { valid: boolean; formatted: string; error?: string } => {
    if (!phone) return { valid: true, formatted: '' }; // Optional field
    
    // Remove all non-numeric except + at the beginning
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Common country patterns
    const patterns = [
      { regex: /^(\+973)?(\d{8})$/, country: 'Bahrain', format: '+973 ' },
      { regex: /^(\+966)?(\d{9})$/, country: 'Saudi Arabia', format: '+966 ' },
      { regex: /^(\+971)?(\d{9})$/, country: 'UAE', format: '+971 ' },
      { regex: /^(\+965)?(\d{8})$/, country: 'Kuwait', format: '+965 ' },
      { regex: /^(\+974)?(\d{8})$/, country: 'Qatar', format: '+974 ' },
      { regex: /^(\+1)?(\d{10})$/, country: 'USA/Canada', format: '+1 ' },
      { regex: /^(\+44)?(\d{10})$/, country: 'UK', format: '+44 ' },
      { regex: /^(\+91)?(\d{10})$/, country: 'India', format: '+91 ' },
    ];
    
    for (const pattern of patterns) {
      if (pattern.regex.test(cleaned)) {
        return { valid: true, formatted: cleaned };
      }
    }
    
    // Allow any number with 7-15 digits
    if (/^\+?\d{7,15}$/.test(cleaned)) {
      return { valid: true, formatted: cleaned };
    }
    
    return { 
      valid: false, 
      formatted: phone,
      error: 'Please enter a valid phone number (7-15 digits, optionally with country code)'
    };
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    const customerName = customer?.name || 'this customer';
    
    if (!confirm(`Are you sure you want to delete ${customerName}? This action cannot be undone.`)) return;
    
    try {
      const response = await fetch(`/api/customers?id=${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchCustomers();
        showSuccess('Customer Deleted', `${customerName} has been successfully removed from your database.`);
      } else {
        throw new Error(result.message || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showError('Failed to delete customer', errorMessage);
    }
  };

  // Memoized filtering for performance
  const filteredCustomers = useMemo(() => {
    return customers?.filter(customer => {
      const matchesSearch = (customer.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (customer.customerCode?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (customer.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || customer.typeCode === filterType;
      return matchesSearch && matchesType;
    }) || [];
  }, [customers, searchQuery, filterType]);

  const customerTypes = [
    { code: 'all', name: 'All Customers' },
    { code: 'EC', name: 'End Customers' },
    { code: 'EP', name: 'Engineering/EPC' },
    { code: 'NR', name: 'National Resellers' },
    { code: 'SI', name: 'System Integrators' },
    { code: 'SP', name: 'Service Providers' }
  ];

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner 
          size="lg" 
          text="Loading Customers..." 
          variant="primary"
          fullPage
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Customer Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            aria-label="Add new customer"
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowAddModal(true);
              }
            }}
          >
            + Add Customer
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div 
          role="search"
          aria-label="Customer search and filter controls"
          style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <label style={{ flex: 1, position: 'relative' }}>
            <span className="sr-only">Search customers</span>
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search customers by name, code, or email"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </label>
          <label style={{ minWidth: '180px' }}>
            <span className="sr-only">Filter by customer type</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter customers by type"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {customerTypes.map(type => (
                <option key={type.code} value={type.code}>{type.name}</option>
              ))}
            </select>
          </label>
          <style jsx>{`
            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }
          `}</style>
        </div>

        {/* Customer Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{customers.length}</p>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>Total Customers</p>
          </div>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#d4edda', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              {customers.filter(c => c.typeCode === 'EC').length}
            </p>
            <p style={{ fontSize: '12px', color: '#155724' }}>End Customers</p>
          </div>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#d1ecf1', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
              {customers.filter(c => c.typeCode === 'EP').length}
            </p>
            <p style={{ fontSize: '12px', color: '#0c5460' }}>EPC Companies</p>
          </div>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
              {customers.filter(c => c.typeCode === 'NR').length}
            </p>
            <p style={{ fontSize: '12px', color: '#856404' }}>Resellers</p>
          </div>
        </div>

        {/* Customer Table */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              Customer Directory ({filteredCustomers.length} customers)
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Country</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                      No customers found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.slice(0, 50).map((customer) => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: '#e7f5ff',
                          color: '#1864ab',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {customer.customerCode}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                        {customer.name}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>{customer.type}</td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {customer.email || '-'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {customer.phone || '-'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>{customer.country}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#d4edda',
                          color: '#155724',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Active
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={() => handleViewCustomer(customer)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '5px'
                          }}>
                          View
                        </button>
                        <button 
                          onClick={() => handleEditCustomer(customer)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '5px'
                          }}>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(customer.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length > 50 && (
            <div style={{ 
              padding: '15px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #e9ecef'
            }}>
              <p style={{ fontSize: '14px', color: '#6c757d' }}>
                Showing 50 of {filteredCustomers.length} customers
              </p>
            </div>
          )}
        </div>

        {/* Add Customer Modal */}
        {showAddModal && (
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
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Add New Customer
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter customer name"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="customer@example.com"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="+973 3333 3333"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </label>
                  <select
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Contractor">Contractor</option>
                    <option value="Government">Government</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Country
                  </label>
                  <select
                    value={newCustomer.country}
                    onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Bahrain">Bahrain</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="UAE">UAE</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Oman">Oman</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={handleAddCustomer}
                  disabled={!newCustomer.name}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: newCustomer.name ? '#28a745' : '#e9ecef',
                    color: newCustomer.name ? 'white' : '#6c757d',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: newCustomer.name ? 'pointer' : 'not-allowed'
                  }}
                >
                  Add Customer
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCustomer({
                      name: '',
                      email: '',
                      phone: '',
                      type: 'Contractor',
                      country: 'Bahrain'
                    });
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Customer Modal */}
        {showViewModal && selectedCustomer && (
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
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Customer Details
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <strong>Code:</strong> <span>{selectedCustomer.customerCode}</span>
                  <strong>Name:</strong> <span>{selectedCustomer.name}</span>
                  <strong>Type:</strong> <span>{selectedCustomer.type}</span>
                  <strong>Status:</strong> <span style={{ color: '#28a745' }}>{selectedCustomer.status}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <strong>Email:</strong> <span>{selectedCustomer.email || 'Not provided'}</span>
                  <strong>Phone:</strong> <span>{selectedCustomer.phone || 'Not provided'}</span>
                  <strong>Country:</strong> <span>{selectedCustomer.country}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button
                  onClick={() => {
                    handleEditCustomer(selectedCustomer);
                    setShowViewModal(false);
                  }}
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
                  Edit Customer
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedCustomer(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
        {showEditModal && selectedCustomer && (
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
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Edit Customer
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editCustomer.name}
                  onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editCustomer.email}
                  onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={editCustomer.phone}
                  onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </label>
                  <select
                    value={editCustomer.type}
                    onChange={(e) => setEditCustomer({ ...editCustomer, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Contractor">Contractor</option>
                    <option value="Government">Government</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Country
                  </label>
                  <select
                    value={editCustomer.country}
                    onChange={(e) => setEditCustomer({ ...editCustomer, country: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Bahrain">Bahrain</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="UAE">UAE</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Oman">Oman</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={handleUpdateCustomer}
                  disabled={!editCustomer.name}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: editCustomer.name ? '#28a745' : '#e9ecef',
                    color: editCustomer.name ? 'white' : '#6c757d',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: editCustomer.name ? 'pointer' : 'not-allowed'
                  }}
                >
                  Update Customer
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCustomer(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
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

// Main export component with providers
export default function CustomersPage() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <CustomersContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}