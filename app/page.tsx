'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            PH Trading ERP
          </h1>
          <p style={{ color: '#6c757d', fontSize: '18px' }}>
            Industrial Equipment Trading Management System
          </p>
        </div>

        {/* Simple Sign-On Button */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '20px 60px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#2E7D32',
              borderRadius: '50px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(46, 125, 50, 0.4)';
              e.currentTarget.style.backgroundColor = '#388e3c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(46, 125, 50, 0.3)';
              e.currentTarget.style.backgroundColor = '#2E7D32';
            }}
          >
            🚀 Enter AsymmFlow ERP
          </a>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
            🚀 System Highlights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>RFQ Sources</p>
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Email, Website, Tender, Direct</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Document Tracking</p>
              <p style={{ fontSize: '14px', fontWeight: '500' }}>6 Mandatory Documents</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Standard Markup</p>
              <p style={{ fontSize: '14px', fontWeight: '500' }}>20% (Configurable)</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Quote Revisions</p>
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Max 3 Per Quote</p>
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef'
        }}>
          <p style={{ color: '#6c757d', fontSize: '12px' }}>
            © 2025 PH Trading WLL • Built for OEM Equipment Trading
          </p>
        </div>
      </div>
    </div>
  );
}