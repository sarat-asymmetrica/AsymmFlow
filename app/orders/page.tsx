'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface Order {
  id: string;
  orderNumber: string;
  poNumber: string;
  customer: string;
  project: string;
  quoteNumber: string;
  items: OrderItem[];
  totalValue: number;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: 'pending' | 'processing' | 'production' | 'shipping' | 'customs' | 'delivered' | 'delayed';
  oemOrderRef: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  documents: DocumentStatus;
}

interface OrderItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface DocumentStatus {
  rfq: boolean;
  quotation: boolean;
  po: boolean;
  deliveryConfirmation: boolean;
  customsDocs: boolean;
  deliveryNote: boolean;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#6c757d';
      case 'processing': return '#6c757d';
      case 'production': return '#17a2b8';
      case 'shipping': return '#007bff';
      case 'customs': return '#ffc107';
      case 'delivered': return '#28a745';
      case 'delayed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return '#28a745';
      case 'partial': return '#ffc107';
      case 'pending': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const countDocuments = (docs: DocumentStatus) => {
    return Object.values(docs).filter(Boolean).length;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDocumentToggle = async (orderId: string, docType: string, currentStatus: boolean) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updatedDocs = {
      ...order.documents,
      [docType]: !currentStatus
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          documents: updatedDocs,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating documents:', error);
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
          <p>Loading Orders...</p>
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
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Orders Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              alert('Consolidate Shipments: Select multiple orders with same destination to combine shipping');
              // TODO: Implement consolidation modal
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Consolidate Shipments
          </button>
          <button
            onClick={() => {
              const customerName = prompt('Enter customer name:');
              if (customerName) {
                window.location.href = '/quotations'; // Go to quotations to create order
              }
            }}
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
            + New Order
          </button>
        </div>
      </div>

      {/* Order Pipeline */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '10px',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{orders.filter(o => o.status === 'pending' || o.status === 'processing').length}</p>
          <p style={{ fontSize: '11px', color: '#6c757d' }}>Processing</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c5460' }}>{orders.filter(o => o.status === 'production').length}</p>
          <p style={{ fontSize: '11px', color: '#0c5460' }}>Production</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#cce5ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#004085' }}>{orders.filter(o => o.status === 'shipping').length}</p>
          <p style={{ fontSize: '11px', color: '#004085' }}>Shipping</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#856404' }}>{orders.filter(o => o.status === 'customs').length}</p>
          <p style={{ fontSize: '11px', color: '#856404' }}>Customs</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#155724' }}>{orders.filter(o => o.status === 'delivered').length}</p>
          <p style={{ fontSize: '11px', color: '#155724' }}>Delivered</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#721c24' }}>{orders.filter(o => o.status === 'delayed').length}</p>
          <p style={{ fontSize: '11px', color: '#721c24' }}>Delayed</p>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Active Orders</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Order #</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>PO #</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Order Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Expected Delivery</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Payment</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Docs (6)</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                    No orders found. Create orders from accepted quotations to get started!
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{order.orderNumber}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{order.poNumber}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{order.customer}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                    ${order.totalValue.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{order.orderDate}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {order.expectedDelivery}
                    {order.actualDelivery && (
                      <span style={{ 
                        display: 'block', 
                        fontSize: '11px', 
                        color: '#28a745',
                        marginTop: '2px'
                      }}>
                        Delivered: {order.actualDelivery}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">PENDING</option>
                      <option value="processing">PROCESSING</option>
                      <option value="production">PRODUCTION</option>
                      <option value="shipping">SHIPPING</option>
                      <option value="customs">CUSTOMS</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="delayed">DELAYED</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: getPaymentStatusColor(order.paymentStatus) + '20',
                      color: getPaymentStatusColor(order.paymentStatus),
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ 
                        fontWeight: '500',
                        color: countDocuments(order.documents) === 6 ? '#28a745' : '#ffc107'
                      }}>
                        {countDocuments(order.documents)}/6
                      </span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Object.entries(order.documents).map(([key, value], idx) => (
                          <div
                            key={key}
                            title={key.replace(/([A-Z])/g, ' $1').trim()}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: value ? '#28a745' : '#dc3545'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => {
                      alert(`Tracking Order ${order.orderNumber}:\n\nStatus: ${order.status}\nLocation: ${order.status === 'shipping' ? 'In Transit - Dubai Port' : 'Warehouse'}\nExpected Delivery: ${new Date(order.expectedDelivery).toLocaleDateString()}`);
                    }} style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}>
                      Track
                    </button>
                    <button onClick={() => {
                      const docs = order.documents;
                      alert(`Document Status for ${order.orderNumber}:\n\n✅ RFQ: ${docs.rfq ? 'Complete' : 'Pending'}\n✅ Quotation: ${docs.quotation ? 'Complete' : 'Pending'}\n✅ PO: ${docs.po ? 'Complete' : 'Pending'}\n📄 Delivery Confirmation: ${docs.deliveryConfirmation ? 'Complete' : 'Pending'}\n📄 Customs: ${docs.customsDocs ? 'Complete' : 'Pending'}\n📄 Delivery Note: ${docs.deliveryNote ? 'Complete' : 'Pending'}`);
                    }} style={{
                      padding: '6px 12px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Docs
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Tracking Note */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f5ff',
        borderRadius: '8px',
        border: '1px solid #74c0fc'
      }}>
        <p style={{ fontSize: '14px', color: '#1864ab', marginBottom: '10px' }}>
          <strong>📄 Mandatory Documents Tracking</strong>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '12px', color: '#1971c2' }}>
          <div>✓ RFQ Document</div>
          <div>✓ Quotation</div>
          <div>✓ Purchase Order</div>
          <div>✓ Delivery Confirmation</div>
          <div>✓ Customs Documents</div>
          <div>✓ Delivery Note</div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}