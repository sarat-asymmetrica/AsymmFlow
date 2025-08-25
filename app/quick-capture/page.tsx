'use client';

import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface QuickCapture {
  id: string;
  type: 'whatsapp' | 'call' | 'email' | 'meeting' | 'exhibition' | 'note';
  content: string;
  customer?: string;
  timestamp: string;
  status: 'unprocessed' | 'processing' | 'converted';
  convertedTo?: 'rfq' | 'lead' | 'followup';
  attachments?: string[];
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export default function QuickCapturePage() {
  const [captures, setCaptures] = useState<QuickCapture[]>([]);
  const [newCapture, setNewCapture] = useState('');
  const [captureType, setCaptureType] = useState<QuickCapture['type']>('whatsapp');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<any>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const captureTypes = [
    { type: 'whatsapp', icon: '💬', color: '#25D366', label: 'WhatsApp' },
    { type: 'call', icon: '📞', color: '#007bff', label: 'Phone Call' },
    { type: 'email', icon: '📧', color: '#dc3545', label: 'Email' },
    { type: 'meeting', icon: '🤝', color: '#6f42c1', label: 'Meeting' },
    { type: 'exhibition', icon: '🏭', color: '#fd7e14', label: 'Exhibition' },
    { type: 'note', icon: '📝', color: '#20c997', label: 'Quick Note' }
  ];

  const quickTemplates = [
    "Customer inquired about [PRODUCT] - needs [QTY] units",
    "Follow up on quotation QT-2025-XXX",
    "Urgent: [CUSTOMER] needs delivery update",
    "Price check for [PRODUCT] from [SUPPLIER]",
    "New lead from [SOURCE] - interested in [PRODUCT]"
  ];

  useEffect(() => {
    // Load saved captures
    const saved = localStorage.getItem('quickCaptures');
    if (saved) {
      setCaptures(JSON.parse(saved));
    }
  }, []);
  
  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }
    
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCapture = () => {
    if (!newCapture.trim()) return;

    const capture: QuickCapture = {
      id: Date.now().toString(),
      type: captureType,
      content: newCapture,
      customer: selectedCustomer,
      timestamp: new Date().toISOString(),
      status: 'unprocessed',
      priority: detectPriority(newCapture)
    };

    const updatedCaptures = [capture, ...captures];
    setCaptures(updatedCaptures);
    localStorage.setItem('quickCaptures', JSON.stringify(updatedCaptures));
    
    setNewCapture('');
    setSelectedCustomer('');
    
    // Show success feedback
    showToast('Captured successfully! Process it when ready.');
  };

  const detectPriority = (text: string): QuickCapture['priority'] => {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency'];
    const highKeywords = ['important', 'priority', 'soon', 'today'];
    
    const lowerText = text.toLowerCase();
    
    if (urgentKeywords.some(k => lowerText.includes(k))) return 'urgent';
    if (highKeywords.some(k => lowerText.includes(k))) return 'high';
    return 'medium';
  };

  const handleConvert = async (capture: QuickCapture, convertTo: 'rfq' | 'lead' | 'followup') => {
    try {
      if (convertTo === 'rfq') {
        // Convert to RFQ
        const rfqData = {
          rfqNumber: `RFQ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
          customer: capture.customer || 'Quick Capture Customer',
          project: `Quick Capture - ${new Date().toLocaleDateString()}`,
          items: [{
            description: capture.content,
            quantity: 1,
            unit: 'Unit',
            specifications: capture.content
          }],
          priority: capture.priority,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        const response = await fetch('/api/rfq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rfqData)
        });
        
        if (response.ok) {
          // Update status
          const updated = captures.map(c => 
            c.id === capture.id 
              ? { ...c, status: 'converted' as const, convertedTo: convertTo }
              : c
          );
          setCaptures(updated);
          localStorage.setItem('quickCaptures', JSON.stringify(updated));
          
          showToast(`Converted to RFQ successfully!`);
          
          // Navigate to RFQ page after a short delay
          setTimeout(() => {
            window.location.href = '/rfq';
          }, 1500);
        }
      } else if (convertTo === 'lead') {
        // Convert to Customer/Lead
        const customerData = {
          name: capture.customer || 'New Lead',
          email: '',
          phone: '',
          type: 'Corporate',
          country: 'Bahrain',
          customerCode: `LEAD-${Date.now().toString().slice(-6)}`,
          typeCode: 'corporate',
          status: 'Lead',
          notes: capture.content
        };
        
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        });
        
        if (response.ok) {
          // Update status
          const updated = captures.map(c => 
            c.id === capture.id 
              ? { ...c, status: 'converted' as const, convertedTo: convertTo }
              : c
          );
          setCaptures(updated);
          localStorage.setItem('quickCaptures', JSON.stringify(updated));
          
          showToast(`Converted to Lead successfully!`);
          
          // Navigate to Customers page after a short delay
          setTimeout(() => {
            window.location.href = '/customers';
          }, 1500);
        }
      } else if (convertTo === 'followup') {
        // Store as follow-up (using localStorage for now)
        const followUpData = {
          id: Date.now().toString(),
          customer: capture.customer || 'Unknown',
          subject: `Follow-up: ${capture.content.substring(0, 50)}...`,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          priority: capture.priority,
          status: 'pending',
          notes: capture.content,
          createdFrom: 'quick-capture'
        };
        
        // Get existing follow-ups
        const existingFollowUps = JSON.parse(localStorage.getItem('followUps') || '[]');
        existingFollowUps.push(followUpData);
        localStorage.setItem('followUps', JSON.stringify(existingFollowUps));
        
        // Update capture status
        const updated = captures.map(c => 
          c.id === capture.id 
            ? { ...c, status: 'converted' as const, convertedTo: convertTo }
            : c
        );
        setCaptures(updated);
        localStorage.setItem('quickCaptures', JSON.stringify(updated));
        
        showToast(`Added to Follow-ups successfully!`);
        
        // Navigate to Follow-ups page after a short delay
        setTimeout(() => {
          window.location.href = '/follow-ups';
        }, 1500);
      }
    } catch (error) {
      console.error(`Error converting to ${convertTo}:`, error);
      showToast(`Failed to convert. Please try again.`);
    }
  };

  const showToast = (message: string) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const getPriorityColor = (priority?: QuickCapture['priority']) => {
    switch(priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>Quick Capture Hub</h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Capture everything now, organize later - the reality of business communication
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ 
              padding: '8px 16px', 
              backgroundColor: '#e7f5ff', 
              borderRadius: '20px',
              fontSize: '14px',
              color: '#1864ab'
            }}>
              {captures.filter(c => c.status === 'unprocessed').length} unprocessed
            </span>
          </div>
        </div>

        {/* Quick Capture Input Area */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          {/* Source Type Selector */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            {captureTypes.map(ct => (
              <button
                key={ct.type}
                onClick={() => setCaptureType(ct.type as QuickCapture['type'])}
                style={{
                  padding: '8px 16px',
                  backgroundColor: captureType === ct.type ? ct.color : '#f8f9fa',
                  color: captureType === ct.type ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <span>{ct.icon}</span>
                {ct.label}
              </button>
            ))}
          </div>

          {/* Main Input Area */}
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              placeholder={`Paste that WhatsApp message, jot down call notes, or capture any business interaction...`}
              value={newCapture}
              onChange={(e) => setNewCapture(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                resize: 'vertical',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleCapture();
                }
              }}
            />
            
            {/* Quick Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '15px'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🎯 Quick Templates
                </button>
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        showToast(`File "${file.name}" attached to capture!`);
                      }
                    };
                    input.click();
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  📎 Attach File
                </button>
                <button
                  onClick={() => {
                    setIsRecording(!isRecording);
                    if (!isRecording) {
                      showToast('Recording started...');
                    } else {
                      showToast(`Voice memo saved (${formatDuration(recordingDuration)})`);
                      setNewCapture(prev => prev + `\n[Voice Memo: ${formatDuration(recordingDuration)}]`);
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: isRecording ? '#dc3545' : '#f8f9fa',
                    color: isRecording ? 'white' : 'black',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    minWidth: isRecording ? '140px' : 'auto'
                  }}
                >
                  {isRecording ? (
                    <>
                      <span>🔴</span> Recording {formatDuration(recordingDuration)}
                    </>
                  ) : (
                    '🎤 Voice Memo'
                  )}
                </button>
              </div>
              
              <button
                onClick={handleCapture}
                disabled={!newCapture.trim()}
                style={{
                  padding: '10px 24px',
                  backgroundColor: newCapture.trim() ? '#28a745' : '#e9ecef',
                  color: newCapture.trim() ? 'white' : '#6c757d',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: newCapture.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                💾 Capture (Ctrl+Enter)
              </button>
            </div>

            {/* Quick Templates Dropdown */}
            {showQuickActions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                marginTop: '5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 10
              }}>
                {quickTemplates.map((template, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setNewCapture(template);
                      setShowQuickActions(false);
                      textareaRef.current?.focus();
                    }}
                    style={{
                      padding: '10px 15px',
                      borderBottom: idx < quickTemplates.length - 1 ? '1px solid #f1f3f5' : 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    {template}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Captured Items */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Recent Captures
          </h2>

          {captures.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#6c757d'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>No captures yet</p>
              <p style={{ fontSize: '14px' }}>
                Start capturing WhatsApp messages, call notes, or any business interactions above
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {captures.slice(0, 10).map(capture => {
                const typeInfo = captureTypes.find(ct => ct.type === capture.type);
                
                return (
                  <div 
                    key={capture.id}
                    style={{
                      padding: '15px',
                      backgroundColor: capture.status === 'converted' ? '#f8f9fa' : 'white',
                      border: `1px solid ${capture.status === 'converted' ? '#dee2e6' : '#e9ecef'}`,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${typeInfo?.color || '#6c757d'}`,
                      opacity: capture.status === 'converted' ? 0.7 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '20px' }}>{typeInfo?.icon}</span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#6c757d',
                            fontWeight: '500'
                          }}>
                            {typeInfo?.label}
                          </span>
                          {capture.priority && (
                            <span style={{
                              padding: '2px 8px',
                              backgroundColor: getPriorityColor(capture.priority) + '20',
                              color: getPriorityColor(capture.priority),
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              {capture.priority.toUpperCase()}
                            </span>
                          )}
                          <span style={{ fontSize: '12px', color: '#6c757d' }}>
                            {new Date(capture.timestamp).toLocaleString()}
                          </span>
                          {capture.status === 'converted' && (
                            <span style={{
                              padding: '2px 8px',
                              backgroundColor: '#d4edda',
                              color: '#155724',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              ✓ Converted to {capture.convertedTo?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p style={{ 
                          fontSize: '14px', 
                          lineHeight: '1.5',
                          color: '#212529',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {capture.content}
                        </p>
                      </div>
                      
                      {capture.status === 'unprocessed' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => handleConvert(capture, 'rfq')}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            → RFQ
                          </button>
                          <button
                            onClick={() => handleConvert(capture, 'lead')}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            → Lead
                          </button>
                          <button
                            onClick={() => handleConvert(capture, 'followup')}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ffc107',
                              color: '#212529',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            → Follow-up
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Smart Insights Panel */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e7f5ff',
          borderRadius: '8px',
          border: '1px solid #74c0fc'
        }}>
          <p style={{ fontSize: '14px', color: '#1864ab', marginBottom: '10px' }}>
            <strong>💡 Pro Tips for Quick Capture</strong>
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '10px',
            fontSize: '12px',
            color: '#1971c2'
          }}>
            <div>📱 Copy-paste WhatsApp messages directly</div>
            <div>🎤 Use voice memos for call summaries</div>
            <div>🏷️ System auto-detects urgency</div>
            <div>🔄 Convert to RFQ/Lead with one click</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </MainLayout>
  );
}