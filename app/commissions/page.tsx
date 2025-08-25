'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface Agent {
  id: string;
  name: string;
  code: string;
  type: 'internal' | 'external' | 'referral';
  baseRate: number; // percentage
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalEarned: number;
  currency: 'BHD' | 'USD';
  phone: string;
  email: string;
  bankDetails?: {
    bank: string;
    iban: string;
    swift: string;
  };
}

interface Commission {
  id: string;
  orderId: string;
  orderValue: number;
  agents: CommissionSplit[];
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  notes?: string;
  currency: 'BHD' | 'USD' | 'EUR';
}

interface CommissionSplit {
  agentId: string;
  agentName: string;
  percentage: number;
  amount: number;
  role: 'primary' | 'support' | 'referral';
}

interface CommissionRule {
  minValue: number;
  maxValue: number;
  rate: number;
  tier: string;
}

export default function CommissionsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAgentHistory, setShowAgentHistory] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCommissionDetails, setShowCommissionDetails] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [calculatorData, setCalculatorData] = useState<{
    orderValue: string;
    currency: 'BHD' | 'USD' | 'EUR';
    agents: { id: string; percentage: number; role: 'primary' | 'support' | 'referral' }[];
  }>({
    orderValue: '',
    currency: 'USD',
    agents: [{ id: '', percentage: 100, role: 'primary' }]
  });

  // Sample data
  useEffect(() => {
    const sampleAgents: Agent[] = [
      {
        id: '1',
        name: 'Ahmed Al-Rashid',
        code: 'AGT-001',
        type: 'internal',
        baseRate: 3,
        tier: 'gold',
        totalEarned: 45670,
        currency: 'USD',
        phone: '+973 3366 7788',
        email: 'ahmed@phtrading.com'
      },
      {
        id: '2',
        name: 'Fatima Hassan',
        code: 'AGT-002',
        type: 'internal',
        baseRate: 2.5,
        tier: 'silver',
        totalEarned: 32450,
        currency: 'USD',
        phone: '+973 3377 8899',
        email: 'fatima@phtrading.com'
      },
      {
        id: '3',
        name: 'Mohammad Singh',
        code: 'AGT-003',
        type: 'external',
        baseRate: 4,
        tier: 'platinum',
        totalEarned: 78900,
        currency: 'USD',
        phone: '+973 3388 9900',
        email: 'mohammad@external.com'
      },
      {
        id: '4',
        name: 'Sara Abdullah',
        code: 'AGT-004',
        type: 'referral',
        baseRate: 1.5,
        tier: 'bronze',
        totalEarned: 12300,
        currency: 'BHD',
        phone: '+973 3399 0011',
        email: 'sara@referral.com'
      }
    ];

    const sampleCommissions: Commission[] = [
      {
        id: '1',
        orderId: 'ORD-2025-001',
        orderValue: 185000,
        agents: [
          { agentId: '1', agentName: 'Ahmed Al-Rashid', percentage: 60, amount: 3330, role: 'primary' },
          { agentId: '2', agentName: 'Fatima Hassan', percentage: 40, amount: 2220, role: 'support' }
        ],
        status: 'approved',
        approvedBy: 'Manager',
        approvedDate: '2025-08-10',
        currency: 'USD'
      },
      {
        id: '2',
        orderId: 'ORD-2025-002',
        orderValue: 92000,
        agents: [
          { agentId: '3', agentName: 'Mohammad Singh', percentage: 100, amount: 3680, role: 'primary' }
        ],
        status: 'paid',
        approvedBy: 'Manager',
        approvedDate: '2025-08-08',
        paidDate: '2025-08-11',
        currency: 'USD'
      },
      {
        id: '3',
        orderId: 'ORD-2025-003',
        orderValue: 45000,
        agents: [
          { agentId: '2', agentName: 'Fatima Hassan', percentage: 70, amount: 787.5, role: 'primary' },
          { agentId: '4', agentName: 'Sara Abdullah', percentage: 30, amount: 337.5, role: 'referral' }
        ],
        status: 'pending',
        currency: 'USD'
      }
    ];

    setAgents(sampleAgents);
    setCommissions(sampleCommissions);
  }, []);

  const commissionRules: CommissionRule[] = [
    { minValue: 0, maxValue: 50000, rate: 2, tier: 'Standard' },
    { minValue: 50001, maxValue: 100000, rate: 2.5, tier: 'Silver' },
    { minValue: 100001, maxValue: 250000, rate: 3, tier: 'Gold' },
    { minValue: 250001, maxValue: Infinity, rate: 4, tier: 'Platinum' }
  ];

  const getCommissionRate = (value: number): CommissionRule => {
    return commissionRules.find(rule => value >= rule.minValue && value <= rule.maxValue) || commissionRules[0];
  };

  const calculateCommission = () => {
    const value = parseFloat(calculatorData.orderValue);
    if (isNaN(value)) return null;

    const rule = getCommissionRate(value);
    const totalCommission = (value * rule.rate) / 100;

    return {
      orderValue: value,
      rate: rule.rate,
      tier: rule.tier,
      totalCommission,
      splits: calculatorData.agents.map(agent => ({
        ...agent,
        amount: (totalCommission * agent.percentage) / 100
      }))
    };
  };

  const addAgentToCalculator = () => {
    setCalculatorData({
      ...calculatorData,
      agents: [...calculatorData.agents, { id: '', percentage: 0, role: 'support' }]
    });
  };

  const updateAgentPercentage = (index: number, percentage: number) => {
    const newAgents = [...calculatorData.agents];
    newAgents[index].percentage = percentage;
    setCalculatorData({ ...calculatorData, agents: newAgents });
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'platinum': return '#e5e4e2';
      case 'gold': return '#ffd700';
      case 'silver': return '#c0c0c0';
      case 'bronze': return '#cd7f32';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return '#28a745';
      case 'approved': return '#17a2b8';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const currencySymbols = {
    BHD: 'BD',
    USD: '$',
    EUR: '€'
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
              Commission Management
            </h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Track agent commissions, splits, and performance bonuses
            </p>
          </div>
          <button
            onClick={() => setShowCalculator(true)}
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
            💰 Commission Calculator
          </button>
        </div>

        {/* Commission Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#155724' }}>
              {currencySymbols.USD}{commissions.reduce((sum, c) => 
                c.status === 'paid' ? sum + c.agents.reduce((s, a) => s + a.amount, 0) : sum, 0
              ).toLocaleString()}
            </p>
            <p style={{ fontSize: '13px', color: '#155724' }}>Paid This Month</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#cce5ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#004085' }}>
              {currencySymbols.USD}{commissions.reduce((sum, c) => 
                c.status === 'approved' ? sum + c.agents.reduce((s, a) => s + a.amount, 0) : sum, 0
              ).toLocaleString()}
            </p>
            <p style={{ fontSize: '13px', color: '#004085' }}>Approved (Pending)</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
              {agents.length}
            </p>
            <p style={{ fontSize: '13px', color: '#856404' }}>Active Agents</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#721c24' }}>
              3.2%
            </p>
            <p style={{ fontSize: '13px', color: '#721c24' }}>Average Rate</p>
          </div>
        </div>

        {/* Agents Grid */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Agent Performance
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '15px'
          }}>
            {agents.map(agent => (
              <div key={agent.id} style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '15px',
                position: 'relative',
                borderTop: `3px solid ${getTierColor(agent.tier)}`
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '3px 8px',
                  backgroundColor: getTierColor(agent.tier) + '20',
                  color: agent.tier === 'gold' || agent.tier === 'bronze' ? '#856404' : '#495057',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {agent.tier}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  {agent.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '12px' }}>
                  {agent.code} • {agent.type}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f8f9fa'
                }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Base Rate</p>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{agent.baseRate}%</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Total Earned</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#28a745' }}>
                      {agent.currency === 'BHD' ? 'BD' : '$'}{agent.totalEarned.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f8f9fa',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button style={{
                    flex: 1,
                    padding: '6px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowAgentHistory(true);
                  }}>
                    View History
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '6px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    alert(`Contacting ${agent.name}\nPhone: ${agent.phone}\nEmail: ${agent.email}`);
                  }}>
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commissions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
              Recent Commissions
            </h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'quarter' | 'year')}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Order Value</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Agents</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Commission</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map(commission => (
                  <tr key={commission.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                      {commission.orderId}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {currencySymbols[commission.currency]}{commission.orderValue.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '12px' }}>
                        {commission.agents.map((agent, idx) => (
                          <div key={idx} style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: '500' }}>{agent.agentName}</span>
                            <span style={{ 
                              marginLeft: '8px',
                              padding: '2px 6px',
                              backgroundColor: '#e7f5ff',
                              color: '#1864ab',
                              borderRadius: '3px',
                              fontSize: '10px'
                            }}>
                              {agent.percentage}% • {agent.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                      {currencySymbols[commission.currency]}
                      {commission.agents.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: getStatusColor(commission.status) + '20',
                        color: getStatusColor(commission.status),
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {commission.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {commission.status === 'pending' && (
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                        onClick={() => {
                          const updatedCommissions = commissions.map(c => 
                            c.id === commission.id 
                              ? { ...c, status: 'approved' as const, approvedBy: 'Manager', approvedDate: new Date().toISOString().split('T')[0] }
                              : c
                          );
                          setCommissions(updatedCommissions);
                          alert(`Commission for Order ${commission.orderId} approved!`);
                        }}>
                          Approve
                        </button>
                      )}
                      {commission.status === 'approved' && (
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}>
                          Mark Paid
                        </button>
                      )}
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedCommission(commission);
                        setShowCommissionDetails(true);
                      }}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Rate Card */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e7f5ff',
          borderRadius: '8px',
          border: '1px solid #74c0fc'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1864ab' }}>
            📊 Commission Rate Structure
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {commissionRules.map((rule, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #a5d8ff'
              }}>
                <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                  {rule.tier}
                </p>
                <p style={{ fontSize: '11px', color: '#1971c2', marginBottom: '3px' }}>
                  ${rule.minValue.toLocaleString()} - {rule.maxValue === Infinity ? '∞' : `$${rule.maxValue.toLocaleString()}`}
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1864ab' }}>
                  {rule.rate}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Calculator Modal */}
        {showCalculator && (
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
          }}
          onClick={() => setShowCalculator(false)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                💰 Commission Calculator
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                  Order Value
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    value={calculatorData.orderValue}
                    onChange={(e) => setCalculatorData({ ...calculatorData, orderValue: e.target.value })}
                    placeholder="Enter order value"
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <select
                    value={calculatorData.currency}
                    onChange={(e) => setCalculatorData({ ...calculatorData, currency: e.target.value as 'BHD' | 'USD' | 'EUR' })}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="USD">USD</option>
                    <option value="BHD">BHD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                  Agent Splits
                </label>
                {calculatorData.agents.map((agent, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select
                      value={agent.id}
                      onChange={(e) => {
                        const newAgents = [...calculatorData.agents];
                        newAgents[idx].id = e.target.value;
                        setCalculatorData({ ...calculatorData, agents: newAgents });
                      }}
                      style={{
                        flex: 2,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Agent</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={agent.percentage}
                      onChange={(e) => updateAgentPercentage(idx, parseFloat(e.target.value) || 0)}
                      placeholder="%"
                      style={{
                        width: '80px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    <select
                      value={agent.role}
                      onChange={(e) => {
                        const newAgents = [...calculatorData.agents];
                        newAgents[idx].role = e.target.value as 'primary' | 'support' | 'referral';
                        setCalculatorData({ ...calculatorData, agents: newAgents });
                      }}
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="primary">Primary</option>
                      <option value="support">Support</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                ))}
                
                <button
                  onClick={addAgentToCalculator}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Agent
                </button>

                {calculatorData.agents.reduce((sum, a) => sum + a.percentage, 0) !== 100 && (
                  <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                    ⚠️ Total must equal 100% (currently {calculatorData.agents.reduce((sum, a) => sum + a.percentage, 0)}%)
                  </p>
                )}
              </div>

              {/* Calculation Result */}
              {calculateCommission() && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                    Commission Breakdown
                  </h3>
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '13px', color: '#6c757d' }}>Order Value</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {currencySymbols[calculatorData.currency]}{parseFloat(calculatorData.orderValue).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '13px', color: '#6c757d' }}>Commission Rate ({calculateCommission()!.tier})</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {calculateCommission()!.rate}%
                    </p>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '13px', color: '#6c757d' }}>Total Commission</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                      {currencySymbols[calculatorData.currency]}{calculateCommission()!.totalCommission.toLocaleString()}
                    </p>
                  </div>
                  
                  <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>Agent Splits:</p>
                    {calculateCommission()!.splits.map((split, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '13px' }}>
                          Agent {idx + 1} ({split.percentage}% - {split.role})
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {currencySymbols[calculatorData.currency]}{split.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    const commission = calculateCommission();
                    if (commission) {
                      const newCommission: Commission = {
                        id: Date.now().toString(),
                        orderId: `ORD-${new Date().getFullYear()}-NEW`,
                        orderValue: parseFloat(calculatorData.orderValue),
                        agents: commission.splits.map((split, idx) => ({
                          agentId: calculatorData.agents[idx].id || `agent-${idx}`,
                          agentName: agents.find(a => a.id === calculatorData.agents[idx].id)?.name || `Agent ${idx + 1}`,
                          percentage: split.percentage,
                          amount: split.amount,
                          role: calculatorData.agents[idx].role
                        })),
                        status: 'pending',
                        currency: calculatorData.currency
                      };
                      setCommissions([newCommission, ...commissions]);
                      alert('Commission saved successfully!');
                    }
                    setShowCalculator(false);
                  }}
                  disabled={calculatorData.agents.reduce((sum, a) => sum + a.percentage, 0) !== 100}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: calculatorData.agents.reduce((sum, a) => sum + a.percentage, 0) === 100 ? '#28a745' : '#e9ecef',
                    color: calculatorData.agents.reduce((sum, a) => sum + a.percentage, 0) === 100 ? 'white' : '#6c757d',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: calculatorData.agents.reduce((sum, a) => sum + a.percentage, 0) === 100 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Save Commission
                </button>
                <button
                  onClick={() => setShowCalculator(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Agent History Modal */}
        {showAgentHistory && selectedAgent && (
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
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Commission History - {selectedAgent.name}</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>Agent Details:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div><strong>Code:</strong> {selectedAgent.code}</div>
                  <div><strong>Type:</strong> {selectedAgent.type}</div>
                  <div><strong>Base Rate:</strong> {selectedAgent.baseRate}%</div>
                  <div><strong>Tier:</strong> {selectedAgent.tier}</div>
                  <div><strong>Total Earned:</strong> ${selectedAgent.totalEarned.toLocaleString()}</div>
                  <div><strong>Phone:</strong> {selectedAgent.phone}</div>
                </div>
              </div>
              
              <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Recent Commissions</h3>
              <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                {commissions
                  .filter(c => c.agents.some(a => a.agentId === selectedAgent.id))
                  .map((comm, idx) => (
                    <div key={idx} style={{
                      padding: '12px',
                      borderBottom: idx < commissions.filter(c => c.agents.some(a => a.agentId === selectedAgent.id)).length - 1 ? '1px solid #eee' : 'none'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <strong>{comm.orderId}</strong>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: comm.status === 'paid' ? '#d4edda' : comm.status === 'approved' ? '#cce5ff' : '#fff3cd',
                          color: comm.status === 'paid' ? '#155724' : comm.status === 'approved' ? '#004085' : '#856404',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {comm.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6c757d' }}>
                        Order Value: ${comm.orderValue.toLocaleString()} • 
                        Commission: ${comm.agents.find(a => a.agentId === selectedAgent.id)?.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
              
              <button
                onClick={() => {
                  setShowAgentHistory(false);
                  setSelectedAgent(null);
                }}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Commission Details Modal */}
        {showCommissionDetails && selectedCommission && (
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
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Commission Details</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Order Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontSize: '14px' }}>
                  <strong>Order ID:</strong> <span>{selectedCommission.orderId}</span>
                  <strong>Order Value:</strong> <span>${selectedCommission.orderValue.toLocaleString()}</span>
                  <strong>Currency:</strong> <span>{selectedCommission.currency}</span>
                  <strong>Status:</strong> 
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: selectedCommission.status === 'paid' ? '#d4edda' : selectedCommission.status === 'approved' ? '#cce5ff' : '#fff3cd',
                    color: selectedCommission.status === 'paid' ? '#155724' : selectedCommission.status === 'approved' ? '#004085' : '#856404',
                    borderRadius: '4px',
                    fontSize: '12px',
                    display: 'inline-block'
                  }}>
                    {selectedCommission.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Commission Split</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontSize: '13px' }}>Agent</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontSize: '13px' }}>Role</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontSize: '13px' }}>%</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontSize: '13px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCommission.agents.map((split, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{split.agentName}</td>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{split.role}</td>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{split.percentage}%</td>
                        <td style={{ padding: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                          ${split.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedCommission.approvedBy && (
                <div style={{ marginBottom: '20px', fontSize: '13px', color: '#6c757d' }}>
                  <p>Approved by: {selectedCommission.approvedBy} on {selectedCommission.approvedDate}</p>
                  {selectedCommission.paidDate && <p>Paid on: {selectedCommission.paidDate}</p>}
                </div>
              )}
              
              <button
                onClick={() => {
                  setShowCommissionDetails(false);
                  setSelectedCommission(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}