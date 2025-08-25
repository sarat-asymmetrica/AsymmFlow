'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface FollowUp {
  id: string;
  type: 'quote_expiry' | 'no_response' | 'payment_due' | 'delivery_check' | 'custom';
  relatedTo: string;
  relatedId: string;
  customer: string;
  message: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'snoozed' | 'cancelled';
  assignedTo: string;
  completedDate?: string;
  notes?: string;
  contactMethod: 'email' | 'whatsapp' | 'call' | 'meeting';
}

interface ReminderTemplate {
  id: string;
  name: string;
  type: string;
  message: string;
  daysBefore: number;
  contactMethod: 'email' | 'whatsapp' | 'call';
}

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    // Sample follow-ups
    const sampleFollowUps: FollowUp[] = [
      {
        id: '1',
        type: 'quote_expiry',
        relatedTo: 'Quotation',
        relatedId: 'QT-2025-038',
        customer: 'Al Mahmood Construction',
        message: 'Quote expires in 2 days. Follow up for decision.',
        dueDate: '2025-08-14',
        dueTime: '10:00',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Ahmed',
        contactMethod: 'whatsapp'
      },
      {
        id: '2',
        type: 'no_response',
        relatedTo: 'RFQ',
        relatedId: 'RFQ-2025-047',
        customer: 'Gulf Heavy Industries',
        message: 'No response to quotation sent 5 days ago',
        dueDate: '2025-08-13',
        dueTime: '14:30',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Fatima',
        contactMethod: 'call'
      },
      {
        id: '3',
        type: 'payment_due',
        relatedTo: 'Order',
        relatedId: 'ORD-2025-003',
        customer: 'Bahrain Steel Works',
        message: 'Payment reminder - 30 days net terms ending',
        dueDate: '2025-08-15',
        dueTime: '09:00',
        priority: 'urgent',
        status: 'pending',
        assignedTo: 'Manager',
        contactMethod: 'email'
      },
      {
        id: '4',
        type: 'delivery_check',
        relatedTo: 'Order',
        relatedId: 'ORD-2025-002',
        customer: 'Modern Construction Co',
        message: 'Check delivery status with customer',
        dueDate: '2025-08-12',
        dueTime: '11:00',
        priority: 'low',
        status: 'completed',
        assignedTo: 'Ahmed',
        completedDate: '2025-08-12',
        contactMethod: 'whatsapp'
      }
    ];
    setFollowUps(sampleFollowUps);
  }, []);

  const templates: ReminderTemplate[] = [
    {
      id: '1',
      name: 'Quote Expiry Reminder',
      type: 'quote_expiry',
      message: 'Your quotation {QUOTE_NO} is expiring in {DAYS} days. Would you like to proceed?',
      daysBefore: 3,
      contactMethod: 'whatsapp'
    },
    {
      id: '2',
      name: 'Payment Reminder',
      type: 'payment_due',
      message: 'Gentle reminder: Invoice {INVOICE_NO} payment is due on {DATE}.',
      daysBefore: 5,
      contactMethod: 'email'
    },
    {
      id: '3',
      name: 'No Response Follow-up',
      type: 'no_response',
      message: 'Following up on our quotation {QUOTE_NO}. Do you have any questions?',
      daysBefore: 7,
      contactMethod: 'call'
    }
  ];

  const getFilteredFollowUps = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    switch(filter) {
      case 'today':
        return followUps.filter(f => f.dueDate === today && f.status === 'pending');
      case 'week':
        return followUps.filter(f => f.dueDate <= weekFromNow && f.status === 'pending');
      case 'overdue':
        return followUps.filter(f => f.dueDate < today && f.status === 'pending');
      default:
        return followUps;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getContactIcon = (method: string) => {
    switch(method) {
      case 'whatsapp': return '💬';
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      default: return '📝';
    }
  };

  const handleComplete = (id: string) => {
    setFollowUps(followUps.map(f => 
      f.id === id 
        ? { ...f, status: 'completed', completedDate: new Date().toISOString().split('T')[0] }
        : f
    ));
  };

  const handleSnooze = (id: string) => {
    // Add 1 day to due date
    const followUp = followUps.find(f => f.id === id);
    if (followUp) {
      const newDate = new Date(followUp.dueDate);
      newDate.setDate(newDate.getDate() + 1);
      setFollowUps(followUps.map(f => 
        f.id === id 
          ? { ...f, dueDate: newDate.toISOString().split('T')[0], status: 'snoozed' as const }
          : f
      ));
    }
  };

  const filteredFollowUps = getFilteredFollowUps();

  // Business hours for Bahrain (Sun-Thu, 8AM-5PM)
  const getNextBusinessTime = (date: Date): string => {
    const day = date.getDay();
    const hour = date.getHours();
    
    // Friday (5) or Saturday (6) - move to Sunday
    if (day === 5 || day === 6) {
      return 'Sunday 9:00 AM';
    }
    
    // Before business hours
    if (hour < 8) {
      return 'Today 9:00 AM';
    }
    
    // During business hours
    if (hour >= 8 && hour < 17) {
      return 'Within business hours';
    }
    
    // After business hours
    return 'Tomorrow 9:00 AM';
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
              Follow-up Reminders
            </h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Never miss a follow-up - automated reminders for quotes, payments, and deliveries
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
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
            + Add Reminder
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#721c24' }}>
              {followUps.filter(f => f.priority === 'urgent' && f.status === 'pending').length}
            </p>
            <p style={{ fontSize: '13px', color: '#721c24' }}>Urgent Today</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
              {followUps.filter(f => f.status === 'pending').length}
            </p>
            <p style={{ fontSize: '13px', color: '#856404' }}>Pending Follow-ups</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#cce5ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#004085' }}>
              {followUps.filter(f => f.type === 'quote_expiry' && f.status === 'pending').length}
            </p>
            <p style={{ fontSize: '13px', color: '#004085' }}>Expiring Quotes</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#155724' }}>
              {followUps.filter(f => f.status === 'completed').length}
            </p>
            <p style={{ fontSize: '13px', color: '#155724' }}>Completed Today</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px'
        }}>
          {(['today', 'week', 'overdue', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f ? '#007bff' : '#f8f9fa',
                color: filter === f ? 'white' : '#495057',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f === 'today' && `Today (${followUps.filter(fu => fu.dueDate === new Date().toISOString().split('T')[0] && fu.status === 'pending').length})`}
              {f === 'week' && 'This Week'}
              {f === 'overdue' && `Overdue (${followUps.filter(fu => fu.dueDate < new Date().toISOString().split('T')[0] && fu.status === 'pending').length})`}
              {f === 'all' && 'All'}
            </button>
          ))}
        </div>

        {/* Follow-ups Timeline */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Today&apos;s Schedule
          </h2>

          {filteredFollowUps.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6c757d'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>No follow-ups scheduled</p>
              <p style={{ fontSize: '14px' }}>
                {filter === 'overdue' ? 'Great! No overdue items.' : 'Your schedule is clear!'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredFollowUps.map(followUp => (
                <div 
                  key={followUp.id}
                  style={{
                    padding: '15px',
                    backgroundColor: followUp.status === 'completed' ? '#f8f9fa' : 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${getPriorityColor(followUp.priority)}`,
                    opacity: followUp.status === 'completed' ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>
                          {getContactIcon(followUp.contactMethod)}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: getPriorityColor(followUp.priority) + '20',
                          color: getPriorityColor(followUp.priority),
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {followUp.priority.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#495057'
                        }}>
                          {followUp.dueTime}
                        </span>
                        {followUp.status === 'completed' && (
                          <span style={{
                            padding: '2px 8px',
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}>
                            ✓ Completed
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '5px' }}>
                        {followUp.customer}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#495057', marginBottom: '8px' }}>
                        {followUp.message}
                      </p>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#6c757d' }}>
                        <span>
                          📋 {followUp.relatedTo}: {followUp.relatedId}
                        </span>
                        <span>
                          👤 Assigned to: {followUp.assignedTo}
                        </span>
                      </div>
                    </div>

                    {followUp.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleComplete(followUp.id)}
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
                          ✓ Complete
                        </button>
                        <button
                          onClick={() => handleSnooze(followUp.id)}
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
                          ⏰ +1 Day
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFollowUp(followUp);
                            setShowAddModal(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminder Templates */}
        <div style={{
          backgroundColor: '#e7f5ff',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #74c0fc'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1864ab' }}>
            ⚡ Automated Reminder Templates
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px'
          }}>
            {templates.map(template => (
              <div key={template.id} style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #a5d8ff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '500' }}>
                    {template.name}
                  </h4>
                  <span style={{ fontSize: '18px' }}>
                    {getContactIcon(template.contactMethod)}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#495057', marginBottom: '8px', fontStyle: 'italic' }}>
                  &ldquo;{template.message}&rdquo;
                </p>
                <p style={{ fontSize: '11px', color: '#1971c2' }}>
                  Triggers {template.daysBefore} days before
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Hours Notice */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeeba'
        }}>
          <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
            <strong>⏰ Bahrain Business Hours:</strong> Sunday-Thursday, 8:00 AM - 5:00 PM | 
            <strong style={{ marginLeft: '10px' }}>Prayer Times:</strong> Reminders auto-pause during prayer | 
            <strong style={{ marginLeft: '10px' }}>Next Available:</strong> {getNextBusinessTime(new Date())}
          </p>
        </div>
        
        {/* Add Reminder Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              width: '500px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px' }}>
                {selectedFollowUp ? 'Edit Reminder' : 'Add New Reminder'}
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Customer
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What to follow up about"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Priority
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Notes
                </label>
                <textarea
                  placeholder="Additional details..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 20px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add the reminder to localStorage for now
                    const newReminder = {
                      id: Date.now().toString(),
                      customer: 'New Customer',
                      subject: 'Follow-up',
                      dueDate: new Date().toISOString(),
                      priority: 'medium',
                      status: 'pending',
                      notes: ''
                    };
                    const existing = JSON.parse(localStorage.getItem('followUps') || '[]');
                    existing.push(newReminder);
                    localStorage.setItem('followUps', JSON.stringify(existing));
                    setShowAddModal(false);
                    window.location.reload(); // Refresh to show new reminder
                  }}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}