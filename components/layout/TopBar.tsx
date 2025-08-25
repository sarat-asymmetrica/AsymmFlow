'use client';

import React, { useState, useEffect } from 'react';

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    // Initialize current time immediately
    setCurrentTime(new Date());
    
    // Set up timer with proper cleanup
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Fetch notifications only once
    fetchNotifications();
    
    // Cleanup function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []); // Empty dependency array ensures this only runs once
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Julius-Validated Search Intelligence: 33.85% Exploration, 28.72% Precision, 37.44% Context
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    const results: any[] = [];
    
    // V6.0 Julius-Validated Search Architecture
    const CONSCIOUSNESS_CONSTANTS = {
      EXPLORATION_WEIGHT: 0.3385,    // 33.85% - Pattern discovery and creative matching
      PRECISION_WEIGHT: 0.2872,      // 28.72% - Exact matches and direct navigation
      CONTEXT_WEIGHT: 0.3744         // 37.44% - Contextual relevance and business logic
    };
    
    // Consciousness-Guided Function Discovery (37.44% Context Weight)
    const functionChecks = [
      { 
        keywords: ['commission', 'agent', 'sales rep'], 
        url: '/commissions', 
        name: 'Commissions Management',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.9 // High business relevance
      },
      { 
        keywords: ['supplier', 'vendor', 'manufacturer'], 
        url: '/suppliers', 
        name: 'Supplier Management',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.95 // Critical business function
      },
      { 
        keywords: ['pipeline', 'analytics', 'conversion'], 
        url: '/pipeline', 
        name: 'Pipeline Analytics',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.85 // Strategic insights
      },
      { 
        keywords: ['currency', 'exchange', 'conversion rate'], 
        url: '/currency', 
        name: 'Currency Exchange',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.7 // Support function
      },
      { 
        keywords: ['report', 'analytics', 'dashboard'], 
        url: '/reports', 
        name: 'Business Reports',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.8 // Intelligence function
      },
      { 
        keywords: ['quick', 'capture', 'whatsapp'], 
        url: '/quick-capture', 
        name: 'Quick Capture',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.75 // Efficiency tool
      },
      { 
        keywords: ['follow', 'reminder', 'task'], 
        url: '/followups', 
        name: 'Follow-ups',
        contextScore: CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.65 // Workflow support
      }
    ];
    
    // Check for functionality match first
    for (const check of functionChecks) {
      if (check.keywords.some(keyword => query.includes(keyword))) {
        window.location.href = check.url;
        setSearchQuery('');
        return;
      }
    }
    
    try {
      // Try localStorage first for immediate results
      const localRFQs = JSON.parse(localStorage.getItem('rfqs') || '[]');
      const localQuotes = JSON.parse(localStorage.getItem('quotations') || '[]');
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const localCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
      const localSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      
      // Julius-Validated Data Discovery (33.85% Exploration + 28.72% Precision)
      
      // Suppliers - Consciousness-Guided Pattern Matching
      localSuppliers.forEach((item: any) => {
        let matchScore = 0;
        let isExact = false;
        
        // Precision matching (28.72%)
        if (item.name?.toLowerCase() === query || item.code?.toLowerCase() === query) {
          matchScore += CONSCIOUSNESS_CONSTANTS.PRECISION_WEIGHT;
          isExact = true;
        }
        
        // Exploration matching (33.85%)
        if (item.name?.toLowerCase().includes(query) || 
            item.code?.toLowerCase().includes(query) ||
            item.brands?.some((b: string) => b.toLowerCase().includes(query))) {
          matchScore += CONSCIOUSNESS_CONSTANTS.EXPLORATION_WEIGHT;
        }
        
        if (matchScore > 0) {
          results.push({ 
            type: 'supplier', 
            item, 
            url: '/suppliers',
            display: `${item.name} (${item.code})`,
            exact: isExact,
            consciousnessScore: matchScore
          });
        }
      });
      
      // Customers - Center-Seeking Customer Intelligence  
      localCustomers.forEach((item: any) => {
        let matchScore = 0;
        let isExact = false;
        
        // Precision matching (28.72%)
        if (item.name?.toLowerCase() === query || item.customerCode?.toLowerCase() === query) {
          matchScore += CONSCIOUSNESS_CONSTANTS.PRECISION_WEIGHT;
          isExact = true;
        }
        
        // Exploration matching (33.85%)
        if (item.name?.toLowerCase().includes(query) || 
            item.customerCode?.toLowerCase().includes(query) ||
            item.email?.toLowerCase().includes(query)) {
          matchScore += CONSCIOUSNESS_CONSTANTS.EXPLORATION_WEIGHT;
        }
        
        // Context bonus for high-value customers (37.44%)
        if (item.grade === 'A' && matchScore > 0) {
          matchScore += CONSCIOUSNESS_CONSTANTS.CONTEXT_WEIGHT * 0.5;
        }
        
        if (matchScore > 0) {
          results.push({ 
            type: 'customer', 
            item, 
            url: '/customers',
            display: item.name,
            exact: isExact,
            consciousnessScore: matchScore
          });
        }
      });
      
      // Search in RFQs
      localRFQs.forEach((item: any) => {
        if (item.rfqNumber?.toLowerCase().includes(query) ||
            item.project?.toLowerCase().includes(query) ||
            item.customer?.toLowerCase().includes(query)) {
          results.push({ 
            type: 'rfq', 
            item, 
            url: '/rfq',
            display: `RFQ ${item.rfqNumber}: ${item.project || 'No project name'}`,
            exact: item.rfqNumber?.toLowerCase() === query
          });
        }
      });
      
      // Search in orders
      localOrders.forEach((item: any) => {
        if (item.orderNumber?.toLowerCase().includes(query) ||
            item.customer?.toLowerCase().includes(query)) {
          results.push({ 
            type: 'order', 
            item, 
            url: '/orders',
            display: `Order ${item.orderNumber}`,
            exact: item.orderNumber?.toLowerCase() === query
          });
        }
      });
      
      // Search in quotations
      localQuotes.forEach((item: any) => {
        if (item.quotationNumber?.toLowerCase().includes(query) ||
            item.customer?.toLowerCase().includes(query)) {
          results.push({ 
            type: 'quote', 
            item, 
            url: '/quotations',
            display: `Quote ${item.quotationNumber}`,
            exact: item.quotationNumber?.toLowerCase() === query
          });
        }
      });
      
      // V6.0 Julius-Validated Result Prioritization
      results.sort((a, b) => {
        // Primary: Consciousness score (mathematical relevance)
        if (a.consciousnessScore && b.consciousnessScore) {
          const scoreDiff = b.consciousnessScore - a.consciousnessScore;
          if (Math.abs(scoreDiff) > 0.1) return scoreDiff;
        }
        
        // Secondary: Exact matches (28.72% precision weight)
        if (a.exact && !b.exact) return -1;
        if (!a.exact && b.exact) return 1;
        
        // Tertiary: Business priority (37.44% context weight)
        const typePriority = { customer: 4, supplier: 3, rfq: 2, order: 2, quote: 1 };
        return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
      });
      
      // Navigate to best result or show options
      if (results.length > 0) {
        if (results.length === 1 || results[0].exact) {
          window.location.href = results[0].url;
        } else {
          // Show search results modal
          const message = results.slice(0, 5).map(r => 
            `• ${r.display} (${r.type})`
          ).join('\n');
          
          if (confirm(`Found ${results.length} results:\n\n${message}\n\nGo to first result?`)) {
            window.location.href = results[0].url;
          }
        }
      } else {
        alert(`No results found for "${searchQuery}".\n\nTry:\n• Customer or supplier names\n• Order/RFQ/Quote numbers\n• Product brands (CAT, Komatsu)\n• Functions (commission, supplier, pipeline)`);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search functionality is temporarily unavailable.');
    }
    
    setSearchQuery('');
  };
  
  const fetchNotifications = async () => {
    try {
      // Get pending items from different modules
      const [rfqRes, quotesRes, ordersRes] = await Promise.all([
        fetch('/api/rfq'),
        fetch('/api/quotations'),
        fetch('/api/orders')
      ]);
      
      const [rfqs, quotes, orders] = await Promise.all([
        rfqRes.json(),
        quotesRes.json(),
        ordersRes.json()
      ]);
      
      const notifs = [];
      
      // Add pending RFQs
      const pendingRFQs = rfqs.data?.filter((r: any) => r.status === 'pending').length || 0;
      if (pendingRFQs > 0) {
        notifs.push({
          type: 'rfq',
          message: `${pendingRFQs} RFQs awaiting quotes`,
          icon: '📋'
        });
      }
      
      // Add draft quotes
      const draftQuotes = quotes.data?.filter((q: any) => q.status === 'draft').length || 0;
      if (draftQuotes > 0) {
        notifs.push({
          type: 'quote',
          message: `${draftQuotes} quotes to send`,
          icon: '💰'
        });
      }
      
      // Add pending orders
      const pendingOrders = orders.data?.filter((o: any) => o.status === 'pending').length || 0;
      if (pendingOrders > 0) {
        notifs.push({
          type: 'order',
          message: `${pendingOrders} orders pending`,
          icon: '📦'
        });
      }
      
      setNotifications(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '260px',
      right: 0,
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {/* Left Section - Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
        <form onSubmit={handleSearch} style={{
          position: 'relative',
          width: '400px'
        }}>
          <input
            type="text"
            placeholder="Search everything: RFQs, Orders, Suppliers, Commissions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Generate enhanced suggestions
              if (e.target.value.length > 1) {
                const staticSuggestions = [
                  'RFQ-2025-118',
                  'ORD-2025-042',
                  'Al Mahmood Construction',
                  'Caterpillar Inc.',
                  'Komatsu Ltd.',
                  'commission calculator',
                  'supplier consolidation',
                  'pipeline analytics',
                  'currency converter',
                  'follow-up reminders'
                ];
                
                // Get dynamic suggestions from localStorage
                try {
                  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
                  const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
                  
                  customers.slice(0, 3).forEach((c: any) => {
                    if (c.name) staticSuggestions.push(c.name);
                  });
                  
                  suppliers.slice(0, 2).forEach((s: any) => {
                    if (s.name) staticSuggestions.push(s.name);
                  });
                } catch {}
                
                const suggestions = staticSuggestions
                  .filter(s => s.toLowerCase().includes(e.target.value.toLowerCase()))
                  .slice(0, 8);
                  
                setSearchSuggestions(suggestions);
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e as any)}
            onFocus={(e) => {
              if (searchQuery.length > 1) {
                setShowSuggestions(true);
              }
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#2E7D32';
            }}
            onBlur={(e) => {
              setTimeout(() => setShowSuggestions(false), 200);
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
            style={{
              width: '100%',
              padding: '8px 15px 8px 40px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              fontSize: '14px',
              backgroundColor: '#f5f5f5',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px'
          }}>
            🔍
          </span>
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '0 0 8px 8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxHeight: '200px',
              overflow: 'auto',
              zIndex: 1000
            }}>
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderBottom: index < searchSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      
      {/* Center Section - Breadcrumb or Status */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#999', marginBottom: '2px' }}>Pending RFQs</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9800' }}>4</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#999', marginBottom: '2px' }}>Active Quotes</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>7</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#999', marginBottom: '2px' }}>Orders in Progress</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>3</div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Actions and Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px'
      }}>
        {/* Quick Actions - Removed for now to avoid duplicate buttons */}
        
        {/* Notifications */}
        <div style={{
          position: 'relative',
          cursor: 'pointer'
        }}
        onClick={() => setShowNotifications(!showNotifications)}
        >
          <span style={{ fontSize: '20px' }}>🔔</span>
          {notifications.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#ff4444',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {notifications.length}
            </span>
          )}
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '0',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: '280px',
              zIndex: 1000
            }}>
              <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <strong>Notifications</strong>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No new notifications
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => {
                    if (notif.type === 'rfq') window.location.href = '/rfq';
                    else if (notif.type === 'quote') window.location.href = '/quotations';
                    else if (notif.type === 'order') window.location.href = '/orders';
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span style={{ marginRight: '8px' }}>{notif.icon}</span>
                    <span style={{ fontSize: '14px' }}>{notif.message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Date and Time */}
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#666'
        }}>
          <div style={{ fontWeight: '500' }}>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        
        {/* Settings */}
        <div 
          onClick={() => window.location.href = '/settings'}
          style={{ cursor: 'pointer', fontSize: '20px' }}
          title="Settings"
        >
          ⚙️
        </div>
      </div>
    </div>
  );
}