'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface Settings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  quotationValidity: number;
  emailNotifications: boolean;
  autoBackup: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'PH Trading WLL',
    email: 'info@phtrading.com',
    phone: '+973 1234 5678',
    address: 'Building 123, Road 456, Block 789, Manama, Bahrain',
    currency: 'USD',
    taxRate: 10,
    quotationValidity: 30,
    emailNotifications: true,
    autoBackup: true
  });
  
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '🏢' },
    { id: 'business', name: 'Business Rules', icon: '📋' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'backup', name: 'Backup & Export', icon: '💾' }
  ];

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>Settings</h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Configure your application preferences
            </p>
          </div>
          <button
            onClick={handleSave}
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
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '10px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#495057',
                border: 'none',
                borderRadius: '6px 6px 0 0',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {activeTab === 'general' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                General Settings
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Business Rules
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Default Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="BHD">BHD (BD)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.5"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Quotation Validity (days)
                  </label>
                  <input
                    type="number"
                    value={settings.quotationValidity}
                    onChange={(e) => setSettings({ ...settings, quotationValidity: parseInt(e.target.value) })}
                    min="1"
                    max="365"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Default Markup (%)
                  </label>
                  <input
                    type="number"
                    value="20"
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#e7f5ff',
                borderRadius: '6px',
                border: '1px solid #74c0fc'
              }}>
                <p style={{ fontSize: '13px', color: '#1864ab' }}>
                  💡 <strong>Business Logic Active:</strong> Maximum 3 revisions per quotation, 
                  20% standard markup, mandatory 6 documents for orders
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Notification Preferences
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    style={{ marginRight: '10px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px' }}>Email notifications for new orders</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    style={{ marginRight: '10px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#6c757d' }}>SMS alerts for urgent RFQs (Coming Soon)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    style={{ marginRight: '10px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#6c757d' }}>WhatsApp integration (Coming Soon)</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Security Settings
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Change Password
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Setup 2FA
                </button>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '6px',
                border: '1px solid #ffc107'
              }}>
                <p style={{ fontSize: '13px', color: '#856404' }}>
                  ⚠️ <strong>Security Note:</strong> Always use strong passwords and enable 
                  two-factor authentication for maximum security.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Backup & Export
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                    style={{ marginRight: '10px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px' }}>Enable automatic daily backups</span>
                </label>
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
                  📥 Export All Data
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
                  ☁️ Backup to Cloud
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  📊 Generate Reports
                </button>
              </div>
              
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#d4edda',
                borderRadius: '6px',
                border: '1px solid #28a745'
              }}>
                <p style={{ fontSize: '13px', color: '#155724' }}>
                  ✅ <strong>Last Backup:</strong> Today at 3:00 AM (Automatic)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}