/**
 * OneDrive Demo Page - Seamless Integration Showcase
 * Demonstrates app-level authentication with JWT Bridge
 */

'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SeamlessFileManager from '../../components/onedrive/SeamlessFileManager';

export default function OneDriveDemoPage() {
  const [userToken, setUserToken] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loginStep, setLoginStep] = useState<'login' | 'demo'>('login');

  // Mock login for demo
  const mockLogin = (role: 'admin' | 'manager' | 'accounts' | 'regular') => {
    // In real app, this comes from your JWT auth
    const mockToken = `mock-jwt-token-${role}-${Date.now()}`;
    setUserToken(mockToken);
    setUserInfo({ role, name: `${role.charAt(0).toUpperCase() + role.slice(1)} User` });
    setLoginStep('demo');
  };

  const logout = () => {
    setUserToken('');
    setUserInfo(null);
    setLoginStep('login');
  };

  if (loginStep === 'login') {
    return (
      <MainLayout>
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: '#333'
            }}>
              🚀 Seamless OneDrive Integration
            </h1>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#666', 
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Experience app-level OneDrive integration with role-based permissions.
              <br />
              <strong>No Microsoft login required!</strong> Your JWT auth handles everything.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => mockLogin('admin')}
                style={{
                  padding: '16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                👑 Login as Admin
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                  1TB • Full Access • All Files
                </div>
              </button>

              <button
                onClick={() => mockLogin('manager')}
                style={{
                  padding: '16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                👨‍💼 Login as Manager
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                  100GB • Team Folders • Sharing
                </div>
              </button>

              <button
                onClick={() => mockLogin('accounts')}
                style={{
                  padding: '16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💰 Login as Accounts
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                  50GB • Finance Only • No Sharing
                </div>
              </button>

              <button
                onClick={() => mockLogin('regular')}
                style={{
                  padding: '16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                👤 Login as Regular
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                  10GB • Public Only • Read Only
                </div>
              </button>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#666',
              border: '1px solid #e9ecef'
            }}>
              <strong>💡 What happens behind the scenes:</strong>
              <br />
              1. You login with YOUR JWT system (no Microsoft auth)
              <br />
              2. Backend authenticates with Microsoft Graph API
              <br />
              3. Files filtered by your role permissions
              <br />
              4. Seamless experience - users never see Azure complexity!
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '4px',
              color: '#333'
            }}>
              🚀 Seamless OneDrive Integration
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: 0
            }}>
              Logged in as: <strong>{userInfo?.name}</strong> • 
              Role-based permissions active • 
              App-level authentication
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Seamless File Manager */}
        <SeamlessFileManager 
          userToken={userToken}
          className="onedrive-demo-manager"
        />

        {/* Info Panel */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '12px',
            color: '#333'
          }}>
            🎯 Integration Benefits
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#e7f3ff',
              borderRadius: '6px',
              border: '1px solid #b3d9ff'
            }}>
              <strong style={{ color: '#0056b3' }}>🔐 Security</strong>
              <br />
              <span style={{ fontSize: '14px', color: '#666' }}>
                Your JWT auth + Microsoft enterprise security
              </span>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#e8f5e8',
              borderRadius: '6px',
              border: '1px solid #b3e5b3'
            }}>
              <strong style={{ color: '#006600' }}>👥 User Experience</strong>
              <br />
              <span style={{ fontSize: '14px', color: '#666' }}>
                Single login, no Azure complexity
              </span>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#fff3e0',
              borderRadius: '6px',
              border: '1px solid #ffcc80'
            }}>
              <strong style={{ color: '#e65100' }}>⚡ Performance</strong>
              <br />
              <span style={{ fontSize: '14px', color: '#666' }}>
                App-level auth, role-based filtering
              </span>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#f3e5f5',
              borderRadius: '6px',
              border: '1px solid #ce93d8'
            }}>
              <strong style={{ color: '#7b1fa2' }}>🚀 Scalability</strong>
              <br />
              <span style={{ fontSize: '14px', color: '#666' }}>
                Easy to add Google Drive, Dropbox, etc.
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}