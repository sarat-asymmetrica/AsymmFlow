'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, CheckCircle, AlertCircle, MapPin, Calendar, Users, Ship } from 'lucide-react';

interface DeliveryItem {
  id: string;
  orderNumber: string;
  customer: string;
  items: string[];
  origin: string;
  destination: string;
  status: 'preparing' | 'in_transit' | 'customs' | 'cleared' | 'delivered';
  shipmentId?: string; // For consolidated shipments
  estimatedDelivery: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  carrier?: string;
}

interface Shipment {
  id: string;
  name: string;
  orders: string[]; // Order IDs
  customers: string[]; // Customer names
  totalItems: number;
  weight?: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'arrived' | 'delivered';
  departureDate?: Date;
  arrivalDate?: Date;
  vesselName?: string;
  containerNumber?: string;
}

export default function DeliveryTracking() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'consolidated'>('individual');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Load mock data (in production, from API)
    loadDeliveryData();
  }, []);

  const loadDeliveryData = () => {
    // Mock delivery data
    const mockDeliveries: DeliveryItem[] = [
      {
        id: 'DEL-001',
        orderNumber: 'ORD-2025-042',
        customer: 'Al Mahmood Construction',
        items: ['CAT 320D Excavator Parts', 'Hydraulic Pumps'],
        origin: 'Germany',
        destination: 'Qatar',
        status: 'in_transit',
        shipmentId: 'SHIP-001',
        estimatedDelivery: new Date('2025-09-15'),
        trackingNumber: 'DHL123456789',
        carrier: 'DHL Express'
      },
      {
        id: 'DEL-002',
        orderNumber: 'ORD-2025-043',
        customer: 'Qatar Steel',
        items: ['Industrial Valves', 'Pressure Gauges'],
        origin: 'Italy',
        destination: 'Qatar',
        status: 'customs',
        shipmentId: 'SHIP-001',
        estimatedDelivery: new Date('2025-09-15'),
        trackingNumber: 'DHL123456790',
        carrier: 'DHL Express'
      },
      {
        id: 'DEL-003',
        orderNumber: 'ORD-2025-044',
        customer: 'Ashghal PWA',
        items: ['Safety Equipment', 'PPE Kits'],
        origin: 'USA',
        destination: 'Qatar',
        status: 'delivered',
        estimatedDelivery: new Date('2025-08-25'),
        actualDelivery: new Date('2025-08-24'),
        trackingNumber: 'FDX987654321',
        carrier: 'FedEx'
      },
      {
        id: 'DEL-004',
        orderNumber: 'ORD-2025-045',
        customer: 'Doha Metro',
        items: ['Electrical Components', 'Control Panels'],
        origin: 'Japan',
        destination: 'Qatar',
        status: 'preparing',
        estimatedDelivery: new Date('2025-09-20')
      }
    ];

    // Mock shipment data (consolidated)
    const mockShipments: Shipment[] = [
      {
        id: 'SHIP-001',
        name: 'September Consolidated Shipment',
        orders: ['ORD-2025-042', 'ORD-2025-043', 'ORD-2025-046'],
        customers: ['Al Mahmood Construction', 'Qatar Steel', 'Gulf Contractors'],
        totalItems: 15,
        weight: '12,500 kg',
        status: 'in_transit',
        departureDate: new Date('2025-09-01'),
        arrivalDate: new Date('2025-09-15'),
        vesselName: 'MSC Oscar',
        containerNumber: 'MSCU1234567'
      },
      {
        id: 'SHIP-002',
        name: 'October Heavy Equipment Batch',
        orders: ['ORD-2025-047', 'ORD-2025-048'],
        customers: ['Doha Port', 'Qatar Airways'],
        totalItems: 8,
        weight: '25,000 kg',
        status: 'preparing',
        departureDate: new Date('2025-10-01'),
        arrivalDate: new Date('2025-10-18')
      }
    ];

    setDeliveries(mockDeliveries);
    setShipments(mockShipments);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      preparing: '#f59e0b',
      in_transit: '#3b82f6',
      customs: '#8b5cf6',
      cleared: '#10b981',
      delivered: '#059669',
      shipped: '#3b82f6',
      arrived: '#10b981'
    };
    return colors[status as keyof typeof colors] || '#64748b';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'in_transit':
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'customs': return <AlertCircle className="w-4 h-4" />;
      case 'cleared':
      case 'arrived': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredDeliveries = selectedStatus === 'all' 
    ? deliveries 
    : deliveries.filter(d => d.status === selectedStatus);

  const stats = {
    total: deliveries.length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    customs: deliveries.filter(d => d.status === 'customs').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    consolidatedShipments: shipments.length
  };

  return (
    <MainLayout>
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '30px' }}
        >
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Delivery Tracking
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            Track shipments, customs clearance, and delivery status
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <Package className="w-5 h-5" style={{ color: '#3b82f6', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Deliveries</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <Truck className="w-5 h-5" style={{ color: '#f59e0b', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {stats.inTransit}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>In Transit</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: '#8b5cf6', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {stats.customs}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>At Customs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: '#10b981', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {stats.delivered}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Delivered</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              color: 'white'
            }}
          >
            <Ship className="w-5 h-5" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600' }}>
              {stats.consolidatedShipments}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Consolidated Shipments</div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '2px'
        }}>
          <button
            onClick={() => setActiveTab('individual')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'individual' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'individual' ? '2px solid #3b82f6' : 'none',
              color: activeTab === 'individual' ? '#3b82f6' : '#64748b',
              fontWeight: activeTab === 'individual' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '-2px'
            }}
          >
            Individual Orders
          </button>
          <button
            onClick={() => setActiveTab('consolidated')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'consolidated' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'consolidated' ? '2px solid #3b82f6' : 'none',
              color: activeTab === 'consolidated' ? '#3b82f6' : '#64748b',
              fontWeight: activeTab === 'consolidated' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '-2px'
            }}
          >
            Consolidated Shipments
          </button>
        </div>

        {/* Individual Deliveries Tab */}
        {activeTab === 'individual' && (
          <>
            {/* Filter */}
            <div style={{ marginBottom: '20px' }}>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="preparing">Preparing</option>
                <option value="in_transit">In Transit</option>
                <option value="customs">At Customs</option>
                <option value="cleared">Cleared</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* Deliveries List */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredDeliveries.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: `${getStatusColor(delivery.status)}15`,
                          color: getStatusColor(delivery.status),
                          border: `1px solid ${getStatusColor(delivery.status)}30`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {getStatusIcon(delivery.status)}
                          {delivery.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {delivery.shipmentId && (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            background: '#f0f9ff',
                            color: '#0369a1',
                            border: '1px solid #bfdbfe'
                          }}>
                            Consolidated: {delivery.shipmentId}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                        Order {delivery.orderNumber}
                      </h3>
                      
                      <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users className="w-3 h-3" />
                          {delivery.customer}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Package className="w-3 h-3" />
                          {delivery.items.join(', ')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin className="w-3 h-3" />
                          {delivery.origin} → {delivery.destination}
                        </div>
                        {delivery.trackingNumber && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Truck className="w-3 h-3" />
                            {delivery.carrier}: {delivery.trackingNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        Est. Delivery
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        {delivery.estimatedDelivery.toLocaleDateString()}
                      </div>
                      {delivery.actualDelivery && (
                        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                          Delivered: {delivery.actualDelivery.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      {['preparing', 'in_transit', 'customs', 'cleared', 'delivered'].map((step) => {
                        const stepIndex = ['preparing', 'in_transit', 'customs', 'cleared', 'delivered'].indexOf(step);
                        const currentIndex = ['preparing', 'in_transit', 'customs', 'cleared', 'delivered'].indexOf(delivery.status);
                        const isActive = stepIndex <= currentIndex;
                        
                        return (
                          <div key={step} style={{ 
                            flex: 1,
                            textAlign: 'center',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: isActive ? getStatusColor(delivery.status) : '#e2e8f0',
                              margin: '0 auto',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              {isActive && '✓'}
                            </div>
                            <div style={{
                              fontSize: '10px',
                              marginTop: '4px',
                              color: isActive ? '#1e293b' : '#94a3b8',
                              textTransform: 'capitalize'
                            }}>
                              {step.replace('_', ' ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Consolidated Shipments Tab */}
        {activeTab === 'consolidated' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            {shipments.map((shipment, index) => (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        {shipment.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                        <span><Package className="w-3 h-3" style={{ display: 'inline' }} /> {shipment.totalItems} items</span>
                        <span><Users className="w-3 h-3" style={{ display: 'inline' }} /> {shipment.customers.length} customers</span>
                        {shipment.weight && <span>⚖️ {shipment.weight}</span>}
                      </div>
                    </div>
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      background: `${getStatusColor(shipment.status)}15`,
                      color: getStatusColor(shipment.status),
                      border: `1px solid ${getStatusColor(shipment.status)}30`
                    }}>
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        Departure
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {shipment.departureDate?.toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        Expected Arrival
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {shipment.arrivalDate?.toLocaleDateString()}
                      </div>
                    </div>
                    {shipment.vesselName && (
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          Vessel
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          {shipment.vesselName}
                        </div>
                      </div>
                    )}
                    {shipment.containerNumber && (
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          Container
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          {shipment.containerNumber}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                      Included Orders
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {shipment.orders.map(order => (
                        <span key={order} style={{
                          padding: '4px 10px',
                          background: '#f0f9ff',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#0369a1'
                        }}>
                          {order}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}