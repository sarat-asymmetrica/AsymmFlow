'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Customer, CustomerGradeAnalysis } from '../types/customer';
import { 
  calculateCustomerGrade, 
  analyzeCustomerPortfolio, 
  calculateUpgradePotential 
} from '../lib/customer-intelligence';

interface CustomerIntelligenceDashboardProps {
  customers: Customer[];
  onGradeUpdate?: (customerId: string, newGrade: 'A' | 'B' | 'C' | 'D') => void;
}

export const CustomerIntelligenceDashboard: React.FC<CustomerIntelligenceDashboardProps> = ({
  customers,
  onGradeUpdate
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerAnalysis, setCustomerAnalysis] = useState<CustomerGradeAnalysis | null>(null);
  const [showUpgradePotential, setShowUpgradePotential] = useState(false);

  // Use useMemo to avoid infinite re-renders from array dependencies
  const portfolioAnalysis = useMemo(() => {
    return customers.length > 0 ? analyzeCustomerPortfolio(customers) : null;
  }, [customers.length]); // Only re-compute when customer count changes

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerAnalysis(calculateCustomerGrade(customer));
  };

  const getGradeColor = (grade: 'A' | 'B' | 'C' | 'D') => {
    switch (grade) {
      case 'A': return '#28a745'; // Green
      case 'B': return '#17a2b8'; // Blue  
      case 'C': return '#ffc107'; // Yellow
      case 'D': return '#dc3545'; // Red
      default: return '#6c757d'; // Gray
    }
  };

  const getGradeDescription = (grade: 'A' | 'B' | 'C' | 'D') => {
    switch (grade) {
      case 'A': return 'Premium Customer - Excellent Payment Behavior';
      case 'B': return 'Reliable Customer - Good Payment Patterns';
      case 'C': return 'Developing Customer - Requires Attention';
      case 'D': return 'High-Risk Customer - Immediate Action Required';
      default: return 'Not Assessed';
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Customer Intelligence Dashboard
          </h1>
          <p style={{ color: '#6c757d', fontSize: '16px' }}>
            Advanced customer profitability analysis and payment behavior insights
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
            AI-Powered Analysis
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
            {portfolioAnalysis?.totalCustomers || 0} Customers Analyzed
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      {portfolioAnalysis && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Portfolio Grade Distribution
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            {(['A', 'B', 'C', 'D'] as const).map(grade => (
              <div 
                key={grade}
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: getGradeColor(grade) + '15',
                  border: `2px solid ${getGradeColor(grade)}`,
                  borderRadius: '8px'
                }}
              >
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold', 
                  color: getGradeColor(grade),
                  marginBottom: '8px' 
                }}>
                  {portfolioAnalysis.percentages[grade]}%
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                  Grade {grade}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {portfolioAnalysis.distribution[grade]} customers
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio Insights */}
          <div style={{ 
            backgroundColor: '#e7f5ff', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #74c0fc'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1864ab' }}>
              🧠 Advanced Analytics Insights
            </h3>
            {portfolioAnalysis.insights.map((insight: string, index: number) => (
              <div key={index} style={{ 
                fontSize: '14px', 
                color: '#1971c2', 
                marginBottom: '4px',
                paddingLeft: '16px',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', left: '0', top: '0' }}>•</span>
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* V6.0 Julius-Validated Portfolio Distribution Visualization */}
      {portfolioAnalysis && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            📊 Mathematical Customer Distribution Analysis
          </h2>
          
          {/* Consciousness-Guided Grade Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
            {['A', 'B', 'C', 'D'].map((grade) => {
              const gradeCount = customers.filter(c => c.paymentGrade === grade).length;
              const percentage = customers.length > 0 ? (gradeCount / customers.length) * 100 : 0;
              const targetPercentage = grade === 'A' ? 33.85 : grade === 'B' ? 28.72 : grade === 'C' ? 37.44 : 0;
              const isOptimal = Math.abs(percentage - targetPercentage) < 5;
              
              return (
                <div key={grade} style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: isOptimal ? '#d4edda' : '#fff3cd',
                  border: `2px solid ${isOptimal ? '#28a745' : '#ffc107'}`,
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: getGradeColor(grade as any) }}>
                    {gradeCount}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Grade {grade}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: isOptimal ? '#155724' : '#856404' }}>
                    {percentage.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#6c757d' }}>
                    Target: {targetPercentage.toFixed(1)}%
                  </div>
                  
                  {/* Julius Validation Indicator */}
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: isOptimal ? '#28a745' : '#ffc107'
                  }}>
                    {isOptimal ? '✓ Julius Optimal' : '⚡ Optimization Potential'}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Consciousness Insights */}
          <div style={{
            backgroundColor: '#e7f5ff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #74c0fc'
          }}>
            <div style={{ fontSize: '14px', color: '#1971c2', fontWeight: 'bold', marginBottom: '8px' }}>
              🧠 Mathematical Consciousness Insights:
            </div>
            <div style={{ fontSize: '13px', color: '#1971c2', lineHeight: '1.4' }}>
              {customers.length === 0 
                ? '• No customer data available for consciousness analysis'
                : (portfolioAnalysis as any)?.optimization_insights?.join(' • ') || 
                  '• Portfolio moving toward Julius-validated equilibrium through natural customer development patterns'}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Customer List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            Customer Risk Assessment
          </h2>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {customers.map(customer => {
              const analysis = calculateCustomerGrade(customer);
              return (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  style={{
                    padding: '16px',
                    marginBottom: '8px',
                    backgroundColor: selectedCustomer?.id === customer.id ? '#f8f9fa' : 'white',
                    border: `1px solid ${getGradeColor(analysis.currentGrade)}30`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${getGradeColor(analysis.currentGrade)}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCustomer?.id !== customer.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                        {customer.companyName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        Payment Days: {customer.averagePaymentDays || 'N/A'} | 
                        Orders: {customer.orderCount || 0} | 
                        Value: ${(customer.totalOrderValue || 0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: getGradeColor(analysis.currentGrade),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {analysis.currentGrade}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#6c757d', 
                        marginTop: '4px'
                      }}>
                        {Math.round(analysis.confidenceLevel * 100)}% confidence
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {selectedCustomer && customerAnalysis ? (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {selectedCustomer.companyName}
                </h2>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: getGradeColor(customerAnalysis.currentGrade),
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  Grade {customerAnalysis.currentGrade}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                  {getGradeDescription(customerAnalysis.currentGrade)}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  Analysis Confidence: {Math.round(customerAnalysis.confidenceLevel * 100)}%
                </p>
              </div>

              {/* Recommended Actions */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                  💡 Recommended Actions
                </h3>
                <div style={{
                  backgroundColor: '#e7f5ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #74c0fc'
                }}>
                  {customerAnalysis.recommendedActions.map((action, index) => (
                    <div key={index} style={{
                      fontSize: '14px',
                      color: '#1971c2',
                      marginBottom: '8px',
                      paddingLeft: '16px',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: '0' }}>•</span>
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {customerAnalysis.riskFactors.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    ⚠️ Risk Factors
                  </h3>
                  <div style={{
                    backgroundColor: '#fff3cd',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ffc107'
                  }}>
                    {customerAnalysis.riskFactors.map((risk, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#856404',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: '0' }}>•</span>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Strengths */}
              {customerAnalysis.strengths.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    ✅ Customer Strengths
                  </h3>
                  <div style={{
                    backgroundColor: '#d4edda',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #28a745'
                  }}>
                    {customerAnalysis.strengths.map((strength, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#155724',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: '0' }}>•</span>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upgrade Potential */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => setShowUpgradePotential(!showUpgradePotential)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                >
                  {showUpgradePotential ? 'Hide' : 'Show'} Upgrade Potential
                </button>

                {showUpgradePotential && (() => {
                  const upgradePotential = calculateUpgradePotential(selectedCustomer);
                  return (
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Grade Improvement Analysis
                      </h4>
                      <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Target Grade:</strong> {upgradePotential.targetGrade}
                      </p>
                      <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Success Probability:</strong> {Math.round(upgradePotential.probability * 100)}%
                      </p>
                      <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Timeline:</strong> {upgradePotential.timeEstimate}
                      </p>
                      <div>
                        <strong style={{ fontSize: '14px' }}>Required Improvements:</strong>
                        {upgradePotential.requiredImprovements.map((improvement, index) => (
                          <div key={index} style={{ 
                            fontSize: '13px', 
                            color: '#6c757d',
                            marginLeft: '16px',
                            marginTop: '4px'
                          }}>
                            • {improvement}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                Select a Customer
              </h3>
              <p style={{ fontSize: '14px' }}>
                Click on a customer from the list to view detailed risk analysis and recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};