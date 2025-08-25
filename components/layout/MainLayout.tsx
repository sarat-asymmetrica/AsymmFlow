'use client';

import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div style={{ 
        marginLeft: '260px',
        width: 'calc(100% - 260px)',
        position: 'relative'
      }}>
        {/* Top Bar */}
        <TopBar />
        
        {/* Page Content */}
        <main style={{
          marginTop: '60px',
          padding: '20px',
          minHeight: 'calc(100vh - 60px)',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}