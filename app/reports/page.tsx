'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface ReportMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');
  
  // Calculate metrics based on real data
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  
  // Mock sales data for visualization
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  
  const calculateMetrics = useCallback(() => {
    // Get data from localStorage for now
    const quotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    // Generate mock sales data based on selected period
    let mockSalesData = [];
    
    if (selectedPeriod === 'day') {
      mockSalesData = [
        { month: '9 AM', revenue: 45000, orders: 2, quotes: 3 },
        { month: '10 AM', revenue: 38000, orders: 1, quotes: 2 },
        { month: '11 AM', revenue: 62000, orders: 3, quotes: 4 },
        { month: '2 PM', revenue: 55000, orders: 2, quotes: 3 },
        { month: '3 PM', revenue: 41000, orders: 2, quotes: 2 },
        { month: '4 PM', revenue: 28000, orders: 1, quotes: 2 }
      ];
    } else if (selectedPeriod === 'week') {
      mockSalesData = [
        { month: 'Mon', revenue: 45000, orders: 3, quotes: 5 },
        { month: 'Tue', revenue: 62000, orders: 4, quotes: 6 },
        { month: 'Wed', revenue: 38000, orders: 2, quotes: 4 },
        { month: 'Thu', revenue: 71000, orders: 5, quotes: 7 },
        { month: 'Fri', revenue: 52000, orders: 3, quotes: 5 },
        { month: 'Sat', revenue: 18000, orders: 1, quotes: 1 }
      ];
    } else if (selectedPeriod === 'quarter') {
      mockSalesData = [
        { month: 'Jan', revenue: 185000, orders: 12, quotes: 18 },
        { month: 'Feb', revenue: 224000, orders: 15, quotes: 22 },
        { month: 'Mar', revenue: 198000, orders: 13, quotes: 20 }
      ];
    } else if (selectedPeriod === 'year') {
      mockSalesData = [
        { month: 'Q1', revenue: 607000, orders: 40, quotes: 60 },
        { month: 'Q2', revenue: 944000, orders: 54, quotes: 77 },
        { month: 'Q3', revenue: 856000, orders: 48, quotes: 71 },
        { month: 'Q4', revenue: 1024000, orders: 62, quotes: 85 }
      ];
    } else { // month (default)
      mockSalesData = [
        { month: 'Jan', revenue: 185000, orders: 12, quotes: 18 },
        { month: 'Feb', revenue: 224000, orders: 15, quotes: 22 },
        { month: 'Mar', revenue: 198000, orders: 13, quotes: 20 },
        { month: 'Apr', revenue: 312000, orders: 18, quotes: 25 },
        { month: 'May', revenue: 287000, orders: 16, quotes: 24 },
        { month: 'Jun', revenue: 345000, orders: 20, quotes: 28 }
      ];
    }
    setSalesData(mockSalesData);
    
    // Generate top products
    const mockTopProducts = [
      { name: 'CAT 320 Excavator', units: 8, revenue: 1480000 },
      { name: 'Komatsu D65 Dozer', units: 5, revenue: 875000 },
      { name: 'JCB 3CX Backhoe', units: 12, revenue: 720000 },
      { name: 'Volvo L90 Loader', units: 6, revenue: 540000 },
      { name: 'Terex Dumper', units: 9, revenue: 495000 }
    ];
    setTopProducts(mockTopProducts);
    
    // Generate top customers
    const mockTopCustomers = [
      { name: 'Al Mahmood Construction', orders: 15, revenue: 875000, country: 'Bahrain' },
      { name: 'Saudi Development Corp', orders: 12, revenue: 650000, country: 'Saudi Arabia' },
      { name: 'Gulf Heavy Industries', orders: 10, revenue: 545000, country: 'UAE' },
      { name: 'Modern Construction Co', orders: 8, revenue: 420000, country: 'Bahrain' },
      { name: 'National Projects LLC', orders: 7, revenue: 385000, country: 'Kuwait' }
    ];
    setTopCustomers(mockTopCustomers);
    
    if (selectedReport === 'sales') {
      const totalRevenue = mockSalesData.reduce((sum, m) => sum + m.revenue, 0);
      const totalOrders = mockSalesData.reduce((sum, m) => sum + m.orders, 0);
      const avgDealSize = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const conversionRate = ((totalOrders / 120) * 100).toFixed(1); // Assuming 120 total quotes
      
      setMetrics([
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12%', trend: 'up' },
        { label: 'Orders', value: totalOrders, change: '+5', trend: 'up' },
        { label: 'Avg Deal Size', value: `$${Math.round(avgDealSize).toLocaleString()}`, trend: 'neutral' },
        { label: 'Conversion Rate', value: `${conversionRate}%`, change: '+2.3%', trend: 'up' }
      ]);
    } else if (selectedReport === 'customers') {
      const activeCustomers = customers.filter((c: any) => c.status === 'Active').length;
      const newCustomers = customers.filter((c: any) => {
        const created = new Date(c.createdAt || Date.now());
        const thisMonth = new Date();
        return created.getMonth() === thisMonth.getMonth() && 
               created.getFullYear() === thisMonth.getFullYear();
      }).length;
      
      setMetrics([
        { label: 'Total Customers', value: customers.length, change: '+8', trend: 'up' },
        { label: 'Active Customers', value: activeCustomers, trend: 'neutral' },
        { label: 'New This Month', value: newCustomers, change: '+3', trend: 'up' },
        { label: 'Retention Rate', value: '92%', change: '+1%', trend: 'up' }
      ]);
    } else if (selectedReport === 'operations') {
      const pendingRFQs = JSON.parse(localStorage.getItem('rfqs') || '[]')
        .filter((r: any) => r.status === 'pending').length;
      const openQuotes = quotations.filter((q: any) => q.status === 'sent').length;
      
      setMetrics([
        { label: 'Pending RFQs', value: pendingRFQs, change: '-2', trend: 'down' },
        { label: 'Open Quotes', value: openQuotes, trend: 'neutral' },
        { label: 'Avg Response Time', value: '4.2 hrs', change: '-0.5 hrs', trend: 'down' },
        { label: 'Quote Accuracy', value: '96%', change: '+2%', trend: 'up' }
      ]);
    } else if (selectedReport === 'inventory') {
      setMetrics([
        { label: 'Total SKUs', value: '1,247', change: '+32', trend: 'up' },
        { label: 'Stock Value', value: '$2.8M', change: '+$150K', trend: 'up' },
        { label: 'Low Stock Items', value: '18', change: '-5', trend: 'down' },
        { label: 'Turnover Rate', value: '4.2x', change: '+0.3x', trend: 'up' }
      ]);
      
      // Generate inventory data
      const inventoryData = [
        { month: 'Week 1', revenue: 420000, orders: 18, quotes: 25 },
        { month: 'Week 2', revenue: 385000, orders: 15, quotes: 22 },
        { month: 'Week 3', revenue: 510000, orders: 22, quotes: 28 },
        { month: 'Week 4', revenue: 465000, orders: 20, quotes: 26 }
      ];
      setSalesData(inventoryData);
    } else if (selectedReport === 'financial') {
      setMetrics([
        { label: 'Gross Margin', value: '28.5%', change: '+1.2%', trend: 'up' },
        { label: 'Operating Expenses', value: '$124K', change: '-$8K', trend: 'down' },
        { label: 'Net Profit', value: '$385K', change: '+$45K', trend: 'up' },
        { label: 'Cash Flow', value: '$1.2M', change: '+$220K', trend: 'up' }
      ]);
      
      // Generate financial data
      const financialData = [
        { month: 'Jan', revenue: 185000, orders: 165000, quotes: 142000 },
        { month: 'Feb', revenue: 224000, orders: 198000, quotes: 176000 },
        { month: 'Mar', revenue: 198000, orders: 172000, quotes: 154000 },
        { month: 'Apr', revenue: 312000, orders: 278000, quotes: 245000 },
        { month: 'May', revenue: 287000, orders: 253000, quotes: 224000 },
        { month: 'Jun', revenue: 345000, orders: 308000, quotes: 272000 }
      ];
      setSalesData(financialData);
    }
  }, [selectedPeriod, selectedReport]);
  
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);
  
  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: '💰' },
    { id: 'customers', name: 'Customer Report', icon: '👥' },
    { id: 'operations', name: 'Operations Report', icon: '⚙️' },
    { id: 'inventory', name: 'Inventory Report', icon: '📦' },
    { id: 'financial', name: 'Financial Report', icon: '📊' }
  ];
  
  const periods = [
    { id: 'day', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];
  
  const getTrendColor = (trend?: string) => {
    switch(trend) {
      case 'up': return '#28a745';
      case 'down': return '#dc3545';
      default: return '#6c757d';
    }
  };
  
  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };
  
  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
              Business Reports
            </h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Analytics and insights for data-driven decisions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
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
              📊 Export Report
            </button>
            <button
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
              📧 Schedule Email
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {reportTypes.map(report => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              style={{
                padding: '20px',
                backgroundColor: selectedReport === report.id ? '#007bff' : 'white',
                color: selectedReport === report.id ? 'white' : '#333',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                if (selectedReport !== report.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{report.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{report.name}</div>
            </div>
          ))}
        </div>

        {/* Period Selector */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '10px' }}>Period:</span>
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedPeriod === period.id ? '#007bff' : '#f8f9fa',
                  color: selectedPeriod === period.id ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {period.name}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {metrics.map((metric, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}>
                <p style={{ fontSize: '13px', color: '#6c757d' }}>{metric.label}</p>
                {metric.change && (
                  <span style={{
                    fontSize: '12px',
                    color: getTrendColor(metric.trend),
                    fontWeight: '500'
                  }}>
                    {getTrendIcon(metric.trend)} {metric.change}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        {(selectedReport === 'sales' || selectedReport === 'inventory' || selectedReport === 'financial') && salesData.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Revenue Trend
            </h3>
            <div style={{ height: '250px', position: 'relative' }}>
              {/* Simple bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '10px' }}>
                {salesData.map((data, idx) => {
                  const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                  const heightPercent = (data.revenue / maxRevenue) * 100;
                  const heightPx = (heightPercent / 100) * 200; // Convert to pixels
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{
                        width: '100%',
                        height: `${heightPx}px`,
                        backgroundColor: '#007bff',
                        borderRadius: '4px 4px 0 0',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                      title={`${data.month}: $${data.revenue.toLocaleString()}`}
                      >
                        <span style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#333'
                        }}>
                          ${(data.revenue/1000).toFixed(0)}k
                        </span>
                      </div>
                      <span style={{ marginTop: '5px', fontSize: '12px', color: '#6c757d' }}>{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Top Products & Customers Grid for Sales */}
        {selectedReport === 'sales' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Top Products */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                🏆 Top Products
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topProducts.map((product, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: idx === 0 ? '#fff9db' : '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{idx + 1}. {product.name}</span>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>{product.units} units sold</div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                      ${(product.revenue/1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Customers */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                👑 Top Customers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topCustomers.map((customer, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: idx === 0 ? '#e7f5ff' : '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{customer.name}</span>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>
                        {customer.orders} orders • {customer.country}
                      </div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                      ${(customer.revenue/1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Customer Report Visualizations */}
        {selectedReport === 'customers' && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Customer Segments</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>18</div>
                  <div style={{ fontSize: '12px', color: '#155724' }}>Enterprise</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#cce5ff', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004085' }}>23</div>
                  <div style={{ fontSize: '12px', color: '#004085' }}>Mid-Market</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>6</div>
                  <div style={{ fontSize: '12px', color: '#856404' }}>Small Business</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>0</div>
                  <div style={{ fontSize: '12px', color: '#721c24' }}>At Risk</div>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Recent Customer Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '500' }}>Al Mahmood Construction</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>New order placed • $185,000 • 2 hours ago</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '500' }}>Gulf Heavy Industries</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Quote requested • CAT 320 Excavator • Yesterday</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '500' }}>Saudi Development Corp</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Payment received • $312,000 • 3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Operations Report Visualizations */}
        {selectedReport === 'operations' && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Process Efficiency</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>RFQ Processing Pipeline</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>Received → Review</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>2.1 hrs</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                        <div style={{ width: '85%', height: '100%', backgroundColor: '#28a745', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>Review → Quote</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>4.3 hrs</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                        <div style={{ width: '70%', height: '100%', backgroundColor: '#ffc107', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>Quote → Follow-up</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>24 hrs</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                        <div style={{ width: '50%', height: '100%', backgroundColor: '#17a2b8', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>Team Performance</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                      <span style={{ fontSize: '12px' }}>Ahmed (Sales)</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#28a745' }}>12 RFQs/day</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                      <span style={{ fontSize: '12px' }}>Sarah (Ops)</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#17a2b8' }}>8 Quotes/day</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                      <span style={{ fontSize: '12px' }}>Mike (Support)</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffc107' }}>15 Follow-ups/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Bottleneck Analysis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24' }}>5 RFQs</div>
                  <div style={{ fontSize: '12px', color: '#721c24' }}>Pending &gt;48 hours</div>
                  <button 
                    onClick={() => window.location.href = '/rfq'}
                    style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#721c24', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Review Now →
                  </button>
                </div>
                <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeeba' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#856404' }}>3 Quotes</div>
                  <div style={{ fontSize: '12px', color: '#856404' }}>Awaiting customer response</div>
                  <button 
                    onClick={() => window.location.href = '/followups'}
                    style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#856404', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Follow Up →
                  </button>
                </div>
                <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #bee5eb' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c5460' }}>2 Orders</div>
                  <div style={{ fontSize: '12px', color: '#0c5460' }}>Missing documentation</div>
                  <button 
                    onClick={() => window.location.href = '/orders'}
                    style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#0c5460', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Update →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Products & Customers Grid - Original */}
        {selectedReport === 'sales-old' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Top Products */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                🏆 Top Products
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topProducts.map((product, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: idx === 0 ? '#fff9db' : '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{idx + 1}. {product.name}</span>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>{product.units} units sold</div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                      ${(product.revenue/1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Customers */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                👑 Top Customers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topCustomers.map((customer, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: idx === 0 ? '#e7f5ff' : '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{customer.name}</span>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>
                        {customer.orders} orders • {customer.country}
                      </div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                      ${(customer.revenue/1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          backgroundColor: '#e7f5ff',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #74c0fc'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1864ab' }}>
            🚀 Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <button 
              onClick={() => {
                const reportData = {
                  period: selectedPeriod,
                  type: selectedReport,
                  metrics: metrics,
                  generatedAt: new Date().toISOString()
                };
                localStorage.setItem('monthlyReportSummary', JSON.stringify(reportData));
                alert(`Monthly ${selectedReport} report generated!\n\nKey Metrics:\n${metrics.map(m => `• ${m.label}: ${m.value}`).join('\n')}\n\nReport saved to system.`);
              }}
              style={{
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #a5d8ff',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              📋 Generate Monthly Summary
            </button>
            <button 
              onClick={() => {
                // Create CSV data
                let csvContent = 'Report Type,Period,Metric,Value,Change,Trend\n';
                metrics.forEach(m => {
                  csvContent += `${selectedReport},${selectedPeriod},${m.label},${m.value},${m.change || 'N/A'},${m.trend || 'N/A'}\n`;
                });
                
                // Create blob and download
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              style={{
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #a5d8ff',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              📊 Export to Excel
            </button>
            <button 
              onClick={() => {
                const emailBody = `${selectedReport.toUpperCase()} REPORT - ${new Date().toLocaleDateString()}\n\n` +
                  `Period: ${selectedPeriod}\n\n` +
                  `KEY METRICS:\n${metrics.map(m => `${m.label}: ${m.value} ${m.change ? '(' + m.change + ')' : ''}`).join('\n')}\n\n` +
                  `Generated by PH Trading ERP System`;
                
                window.location.href = `mailto:management@phtrading.com?subject=${selectedReport} Report - ${new Date().toLocaleDateString()}&body=${encodeURIComponent(emailBody)}`;
              }}
              style={{
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #a5d8ff',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              📧 Email to Management
            </button>
            <button 
              onClick={() => {
                window.print();
              }}
              style={{
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #a5d8ff',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}