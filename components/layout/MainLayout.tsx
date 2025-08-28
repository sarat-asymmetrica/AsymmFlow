'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on desktop
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen && sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '15px',
            left: '15px',
            zIndex: 1001,
            padding: '10px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                exit={{ rotate: 0 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              zIndex: 998
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop always visible, Mobile animated */}
      {!isMobile ? (
        <div 
          className="sidebar-container"
          style={{ 
            width: '260px',
            position: 'relative',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'white',
            borderRight: '1px solid #e9ecef'
          }}
        >
          <style jsx>{`
            .sidebar-container::-webkit-scrollbar {
              width: 8px;
            }
            .sidebar-container::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            .sidebar-container::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 4px;
            }
            .sidebar-container::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}</style>
          <Sidebar />
        </div>
      ) : (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              ref={sidebarRef}
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '260px',
                height: '100vh',
                backgroundColor: 'white',
                zIndex: 999,
                overflowY: 'auto',
                overflowX: 'hidden',
                borderRight: '1px solid #e9ecef',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ paddingTop: '60px' }}>
                <Sidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Main Content Area */}
      <div style={{ 
        marginLeft: isMobile ? 0 : '260px',
        width: isMobile ? '100%' : 'calc(100% - 260px)',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}>
        {/* Top Bar */}
        <TopBar />
        
        {/* Page Content */}
        <main style={{
          marginTop: isMobile ? '70px' : '60px',
          padding: isMobile ? '15px' : '20px',
          minHeight: 'calc(100vh - 60px)',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}