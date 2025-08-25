'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface Supplier {
  id: string;
  name: string;
  code: string;
  country: string;
  category: string;
  brands: string[];
  leadTime: {
    standard: number; // days
    express: number;  // days
  };
  paymentTerms: string;
  currency: 'USD' | 'EUR' | 'BHD';
  rating: number; // 1-5
  status: 'active' | 'inactive' | 'preferred';
  lastOrderDate?: string;
  totalOrders: number;
  priceHistory?: PriceEntry[];
  contactPerson: string;
  email: string;
  phone: string;
  certifications: string[];
}

interface PriceEntry {
  productCode: string;
  productName: string;
  price: number;
  currency: string;
  date: string;
  quantity: number;
  validUntil: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample data for demonstration
  useEffect(() => {
    const sampleSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'Caterpillar Inc.',
        code: 'CAT-US',
        country: 'USA',
        category: 'Heavy Machinery',
        brands: ['CAT', 'Perkins'],
        leadTime: { standard: 45, express: 21 },
        paymentTerms: 'Net 30',
        currency: 'USD',
        rating: 5,
        status: 'preferred',
        lastOrderDate: '2025-08-01',
        totalOrders: 127,
        contactPerson: 'John Smith',
        email: 'john@cat.com',
        phone: '+1-309-675-1000',
        certifications: ['ISO 9001', 'ISO 14001'],
        priceHistory: [
          {
            productCode: 'CAT-320',
            productName: 'Excavator 320',
            price: 185000,
            currency: 'USD',
            date: '2025-07-15',
            quantity: 1,
            validUntil: '2025-09-15'
          }
        ]
      },
      {
        id: '2',
        name: 'Komatsu Ltd.',
        code: 'KOM-JP',
        country: 'Japan',
        category: 'Heavy Machinery',
        brands: ['Komatsu'],
        leadTime: { standard: 60, express: 30 },
        paymentTerms: 'LC at sight',
        currency: 'USD',
        rating: 4,
        status: 'active',
        lastOrderDate: '2025-07-20',
        totalOrders: 89,
        contactPerson: 'Takeshi Yamada',
        email: 'yamada@komatsu.jp',
        phone: '+81-3-5561-2616',
        certifications: ['ISO 9001', 'OHSAS 18001']
      },
      {
        id: '3',
        name: 'Volvo Construction Equipment',
        code: 'VOLVO-SE',
        country: 'Sweden',
        category: 'Heavy Machinery',
        brands: ['Volvo CE'],
        leadTime: { standard: 50, express: 25 },
        paymentTerms: 'Net 45',
        currency: 'EUR',
        rating: 5,
        status: 'preferred',
        lastOrderDate: '2025-08-05',
        totalOrders: 103,
        contactPerson: 'Erik Andersson',
        email: 'erik@volvoce.com',
        phone: '+46-31-66-00-00',
        certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001']
      }
    ];
    setSuppliers(sampleSuppliers);
  }, []);

  const categories = [
    'all',
    'Heavy Machinery',
    'Spare Parts',
    'Tools & Equipment',
    'Safety Equipment',
    'Consumables'
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          supplier.brands.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'preferred': return '#28a745';
      case 'active': return '#007bff';
      case 'inactive': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#ffc107' : '#e9ecef' }}>★</span>
    ));
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>Supplier Management</h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Track suppliers, lead times, price history, and consolidation opportunities
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
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
            + Add Supplier
          </button>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '20px',
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <input
            type="text"
            placeholder="Search by supplier, code, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '180px'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d4edda', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#155724' }}>
              {suppliers.filter(s => s.status === 'preferred').length}
            </p>
            <p style={{ fontSize: '13px', color: '#155724' }}>Preferred Suppliers</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#cce5ff', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#004085' }}>
              {suppliers.filter(s => s.status === 'active').length}
            </p>
            <p style={{ fontSize: '13px', color: '#004085' }}>Active Suppliers</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
              35 days
            </p>
            <p style={{ fontSize: '13px', color: '#856404' }}>Avg Lead Time</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8d7da', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#721c24' }}>
              3
            </p>
            <p style={{ fontSize: '13px', color: '#721c24' }}>Consolidation Available</p>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {filteredSuppliers.map(supplier => (
            <div 
              key={supplier.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderTop: `4px solid ${getStatusColor(supplier.status)}`
              }}
              onClick={() => setSelectedSupplier(supplier)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                    {supplier.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#e7f5ff',
                      color: '#1864ab',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {supplier.code}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>
                      {supplier.country} 🌍
                    </span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    {renderStars(supplier.rating)}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: getStatusColor(supplier.status) + '20',
                  color: getStatusColor(supplier.status),
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  {supplier.status}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Brands</p>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {supplier.brands.map(brand => (
                    <span key={brand} style={{
                      padding: '3px 8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}>
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px',
                paddingTop: '15px',
                borderTop: '1px solid #e9ecef'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Lead Time</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {supplier.leadTime.standard}d / {supplier.leadTime.express}d ⚡
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Payment</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {supplier.paymentTerms}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Currency</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {supplier.currency}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Total Orders</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {supplier.totalOrders}
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '10px',
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #e9ecef'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSupplier(supplier);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📊 Price History
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${supplier.email}`;
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📧 Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Consolidation Opportunities */}
        <div style={{
          backgroundColor: '#e7f5ff',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #74c0fc'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1864ab' }}>
            🚢 Shipment Consolidation Opportunities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #a5d8ff'
            }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Combine CAT + Volvo Orders
              </p>
              <p style={{ fontSize: '12px', color: '#1971c2', marginBottom: '5px' }}>
                3 pending orders from USA/Europe
              </p>
              <p style={{ fontSize: '13px', color: '#28a745', fontWeight: '500' }}>
                Potential savings: $2,500 (15%)
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #a5d8ff'
            }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Japan Suppliers Bundle
              </p>
              <p style={{ fontSize: '12px', color: '#1971c2', marginBottom: '5px' }}>
                2 Komatsu orders can ship together
              </p>
              <p style={{ fontSize: '13px', color: '#28a745', fontWeight: '500' }}>
                Potential savings: $1,800 (12%)
              </p>
            </div>
          </div>
        </div>

        {/* Supplier Detail Modal */}
        {selectedSupplier && (
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
          }}
          onClick={() => setSelectedSupplier(null)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                {selectedSupplier.name}
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>Contact Information</p>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
                  <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                    <strong>Contact:</strong> {selectedSupplier.contactPerson}
                  </p>
                  <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                    <strong>Email:</strong> {selectedSupplier.email}
                  </p>
                  <p style={{ fontSize: '14px' }}>
                    <strong>Phone:</strong> {selectedSupplier.phone}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>Certifications</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedSupplier.certifications.map(cert => (
                    <span key={cert} style={{
                      padding: '5px 10px',
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedSupplier(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Add Supplier Modal */}
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
              borderRadius: '8px',
              padding: '30px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Add New Supplier</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Supplier Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter supplier name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Supplier Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CAT-US"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Country
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}>
                    <option>USA</option>
                    <option>Japan</option>
                    <option>Germany</option>
                    <option>UK</option>
                    <option>China</option>
                    <option>UAE</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Category
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}>
                  <option>Heavy Machinery</option>
                  <option>Construction Materials</option>
                  <option>Safety Equipment</option>
                  <option>Tools & Hardware</option>
                  <option>Electrical Equipment</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Brands (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., CAT, Perkins"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Standard Lead Time (days)
                  </label>
                  <input
                    type="number"
                    placeholder="45"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Express Lead Time (days)
                  </label>
                  <input
                    type="number"
                    placeholder="21"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Payment Terms
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}>
                    <option>Net 30</option>
                    <option>Net 60</option>
                    <option>LC at sight</option>
                    <option>Advance Payment</option>
                    <option>50% Advance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Currency
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>BHD</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@supplier.com"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1-234-567-8900"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    alert('Supplier added successfully!');
                    setShowAddModal(false);
                  }}
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
                  Add Supplier
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
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