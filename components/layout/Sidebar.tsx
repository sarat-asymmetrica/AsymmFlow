'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  
  const menuItems: MenuItem[] = [
    { 
      title: 'Dashboard', 
      href: '/dashboard', 
      icon: '📊'
    },
    { 
      title: 'Data Migration', 
      href: '/data-migration', 
      icon: '☁️',
      badge: 3 // Files ready for migration
    },
    { 
      title: 'Customer Intelligence', 
      href: '/customer-intelligence', 
      icon: '🧠',
      badge: 5 // Number of high-risk customers requiring attention
    },
    { 
      title: 'Competition Intelligence', 
      href: '/competition-intelligence', 
      icon: '🎯',
      badge: 2 // Number of ABB threats requiring attention
    },
    { 
      title: 'Pipeline Analytics', 
      href: '/pipeline', 
      icon: '📈'
    },
    { 
      title: 'Follow-ups', 
      href: '/follow-ups', 
      icon: '⏰',
      badge: 3
    },
    { 
      title: 'Quick Capture', 
      href: '/quick-capture', 
      icon: '⚡',
      badge: 3 // Unprocessed captures
    },
    { 
      title: 'RFQ Management', 
      href: '/rfq', 
      icon: '📋',
      badge: 4 // Could be dynamic
    },
    { 
      title: 'Quotations', 
      href: '/quotations', 
      icon: '💰',
      badge: 2
    },
    { 
      title: 'Orders', 
      href: '/orders', 
      icon: '📦',
      badge: 1
    },
    { 
      title: 'Customers', 
      href: '/customers', 
      icon: '👥'
    },
    { 
      title: 'Suppliers', 
      href: '/suppliers', 
      icon: '🏭'
    },
    { 
      title: 'Commissions', 
      href: '/commissions', 
      icon: '💰'
    },
    { 
      title: 'Currency', 
      href: '/currency', 
      icon: '💱'
    },
    { 
      title: 'Reports', 
      href: '/reports', 
      icon: '📈'
    },
    { 
      title: 'Settings', 
      href: '/settings', 
      icon: '⚙️'
    }
  ];
  
  const isActive = (href: string) => pathname === href;
  
  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#1a1f2e',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '20px'
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              PH
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>PH Trading</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>ERP System v2.0</div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '0 15px' }}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 15px',
                marginBottom: '5px',
                borderRadius: '8px',
                backgroundColor: isActive(item.href) ? 'rgba(46, 125, 50, 0.2)' : 'transparent',
                border: isActive(item.href) ? '1px solid #2E7D32' : '1px solid transparent',
                color: isActive(item.href) ? '#4CAF50' : 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontWeight: isActive(item.href) ? '500' : '400' }}>
                  {item.title}
                </span>
              </div>
              {item.badge && item.badge > 0 && (
                <span style={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        ))}
      </nav>
      
      {/* Bottom Section */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(46, 125, 50, 0.3)',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px' }}>System Status</div>
          <div style={{ fontSize: '13px', color: '#4CAF50', fontWeight: '500' }}>
            ✓ All Systems Operational
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#2E7D32',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>Admin User</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>admin@phtrading.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}