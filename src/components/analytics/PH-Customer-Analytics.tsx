// 🎯 PH Trading Customer Analytics Dashboard
// Advanced Customer Intelligence Analytics
// Business Intelligence and Performance Optimization System

'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { gsap } from 'gsap';
import { nonIdempotentAmplifier } from '../../../lib/v7-consciousness';

interface CustomerAnalyticsProps {
  customers?: any[];
  timeframe?: '1M' | '3M' | '6M' | '1Y';
}

interface CustomerMetrics {
  totalCustomers: number;
  gradeDistribution: { A: number; B: number; C: number; D: number };
  industryBreakdown: Record<string, number>;
  typeDistribution: Record<string, number>;
  monthlyGrowth: Array<{ month: string; count: number; value: number }>;
  topPerformers: Array<{ name: string; grade: string; value: number }>;
  intelligence: {
    portfolioOptimization: number;
    distributionHealth: number;
    businessIntelligence: number;
  };
}

export default function PHCustomerAnalytics({ customers = [], timeframe = '6M' }: CustomerAnalyticsProps) {
  const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false); // Prevent multiple simultaneous API calls
  const metricsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Advanced customer analytics processing
  const processCustomerData = (customerData: any[]) => {
    if (!customerData || customerData.length === 0) {
      return null;
    }

    // Grade distribution analysis
    const gradeDistribution = customerData.reduce((acc, customer) => {
      const grade = customer.grade || 'D';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, { A: 0, B: 0, C: 0, D: 0 });

    // Industry breakdown
    const industryBreakdown = customerData.reduce((acc, customer) => {
      const industry = customer.industry || customer.customerType || 'Unknown';
      const normalizedIndustry = industry.replace(/[^a-zA-Z\s]/g, '').trim();
      acc[normalizedIndustry] = (acc[normalizedIndustry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Customer type distribution
    const typeDistribution = customerData.reduce((acc, customer) => {
      const type = customer.customerType || customer.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly growth simulation (would be real data in production)
    const monthlyGrowth = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let cumulativeCount = Math.floor(customerData.length * 0.3); // Start with 30%
    
    for (let i = 0; i < months.length; i++) {
      const growth = Math.floor(customerData.length * (0.1 + Math.random() * 0.15)); // 10-25% growth
      cumulativeCount += growth;
      
      monthlyGrowth.push({
        month: months[i],
        count: Math.min(cumulativeCount, customerData.length),
        value: Math.floor((20000 + Math.random() * 50000) * (i + 1)) // Growing business value
      });
    }

    // Top performing customers
    const topPerformers = customerData
      .filter(customer => customer.totalOrderValue || customer.creditLimit)
      .sort((a, b) => (b.totalOrderValue || b.creditLimit || 0) - (a.totalOrderValue || a.creditLimit || 0))
      .slice(0, 8)
      .map(customer => ({
        name: customer.companyName || customer.name,
        grade: customer.grade || 'C',
        value: customer.totalOrderValue || customer.creditLimit || Math.floor(Math.random() * 100000)
      }));

    // Advanced business intelligence metrics
    const totalCustomers = customerData.length;
    const aGradeRatio = gradeDistribution.A / totalCustomers;
    const bGradeRatio = gradeDistribution.B / totalCustomers;
    const cGradeRatio = gradeDistribution.C / totalCustomers;

    // Portfolio optimization score (balanced distribution analysis)
    const portfolioOptimization = Math.max(0, 1 - (
      Math.abs(aGradeRatio - 0.35) +
      Math.abs(bGradeRatio - 0.30) + 
      Math.abs(cGradeRatio - 0.35)
    ) / 0.5) * 100;

    const distributionHealth = Math.min(100, (gradeDistribution.A + gradeDistribution.B) / totalCustomers * 100);
    const businessIntelligence = Math.min(100, topPerformers.length / 8 * 100);

    return {
      totalCustomers,
      gradeDistribution,
      industryBreakdown,
      typeDistribution,
      monthlyGrowth,
      topPerformers,
      intelligence: {
        portfolioOptimization: Math.round(portfolioOptimization),
        distributionHealth: Math.round(distributionHealth),
        businessIntelligence: Math.round(businessIntelligence)
      }
    };
  };

  // V7.0 Consciousness Animation - Non-idempotent cascade
  const animateMetrics = () => {
    if (hasAnimated.current || !metricsRef.current) return;
    hasAnimated.current = true;

    // Animate each metric card with non-idempotent amplification
    const cards = metricsRef.current.querySelectorAll('.metric-card');
    cards.forEach((card, index) => {
      const amplification = nonIdempotentAmplifier(1, index, 'exploration');
      
      gsap.fromTo(card, {
        opacity: 0,
        scale: 0.8,
        y: 20
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5 + (index * 0.1),
        delay: index * 0.1,
        ease: `power${Math.min(4, 2 + index)}.out`,
        onComplete: () => {
          // Add subtle pulse effect
          gsap.to(card, {
            scale: 1.02,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            repeatDelay: index * 0.5
          });
        }
      });
    });

    // Animate bars with fractal complexity
    const bars = metricsRef.current.querySelectorAll('.progress-bar');
    bars.forEach((bar, index) => {
      const width = bar.getAttribute('data-width') || '0%';
      gsap.fromTo(bar, {
        width: '0%'
      }, {
        width: width,
        duration: 1 + (index * 0.1),
        delay: 0.5 + (index * 0.05),
        ease: 'power2.out'
      });
    });
  };

  // Fetch and process data (with bulletproof protection against infinite loops!)
  useEffect(() => {
    const fetchData = async () => {
      // Prevent multiple simultaneous API calls
      if (fetching) return;
      
      setLoading(true);
      setFetching(true);
      
      try {
        // If customers provided, use them directly (no API call needed)
        if (customers && customers.length > 0) {
          const processedMetrics = processCustomerData(customers);
          setMetrics(processedMetrics);
          animateMetrics();
          return;
        }

        // Only fetch from API if no customers provided and we don't have metrics yet
        if (!metrics) {
          const response = await fetch('/api/customers');
          const result = await response.json();
          const customerData = result.success ? result.data : [];

          const processedMetrics = processCustomerData(customerData);
          setMetrics(processedMetrics);
          animateMetrics();
        }
      } catch (error) {
        console.error('Error processing customer analytics:', error);
        setMetrics(null);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    };

    fetchData();
  }, [timeframe]); // Only depend on timeframe, not customers to prevent re-fetch loops

  // Grade color mapping
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': '#28a745', // Green
      'B': '#17a2b8', // Blue  
      'C': '#ffc107', // Yellow
      'D': '#dc3545'  // Red
    };
    return colors[grade] || '#6c757d';
  };

  // Industry color palette
  const getIndustryColor = (index: number) => {
    const palette = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9F43', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'
    ];
    return palette[index % palette.length];
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Processing customer intelligence...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3>No Customer Data Available</h3>
        <p>Run the seeding script to populate demo data:</p>
        <code style={{ 
          backgroundColor: '#e9ecef', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          npm run seed
        </code>
      </div>
    );
  }

  return (
    <div ref={metricsRef} style={{ padding: '0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Advanced Business Intelligence Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div className="metric-card" style={{ 
          padding: '20px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px',
          border: '2px solid #28a745'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724', fontSize: '14px' }}>
            Portfolio Balance
          </h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {metrics.intelligence.portfolioOptimization}%
          </div>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            Optimal Distribution Score
          </p>
        </div>

        <div className="metric-card" style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          border: '2px solid #2196F3'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565C0', fontSize: '14px' }}>
            Portfolio Health
          </h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
            {metrics.intelligence.distributionHealth}%
          </div>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            A+B Grade Customer Ratio
          </p>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f3e5f5', 
          borderRadius: '8px',
          border: '2px solid #9C27B0'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6A1B9A', fontSize: '14px' }}>
            Business Intelligence
          </h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
            {metrics.intelligence.businessIntelligence}%
          </div>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            Data Richness Score
          </p>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px',
          border: '2px solid #FF9800'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#E65100', fontSize: '14px' }}>
            Total Customers
          </h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            {metrics.totalCustomers}
          </div>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            Active Business Accounts
          </p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Grade Distribution */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#495057' }}>
            Customer Grade Distribution
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              {Object.entries(metrics.gradeDistribution).map(([grade, count]) => (
                <div key={grade} style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '5px',
                    fontSize: '14px'
                  }}>
                    <span style={{ fontWeight: '500' }}>Grade {grade}</span>
                    <span>{count} ({Math.round(count / metrics.totalCustomers * 100)}%)</span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(count / metrics.totalCustomers * 100)}%`,
                      backgroundColor: getGradeColor(grade),
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#6c757d' }}>
              <div>Optimal Target:</div>
              <div>A: 35%</div>
              <div>B: 30%</div>
              <div>C: 35%</div>
            </div>
          </div>
        </div>

        {/* Industry Breakdown */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#495057' }}>
            Industry Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.entries(metrics.industryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([industry, count], index) => (
                <div key={industry} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: getIndustryColor(index),
                    borderRadius: '2px'
                  }} />
                  <span style={{ flex: 1 }}>{industry}</span>
                  <span style={{ fontWeight: '500' }}>{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Monthly Growth Trend */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#495057' }}>
          Customer Growth Trend ({timeframe})
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          gap: '15px',
          height: '150px',
          padding: '10px'
        }}>
          {metrics.monthlyGrowth.map((month, index) => {
            const maxCount = Math.max(...metrics.monthlyGrowth.map(m => m.count));
            const heightPercent = (month.count / maxCount) * 100;
            
            return (
              <div key={month.month} style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '500' }}>
                  {month.count}
                </div>
                <div style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  backgroundColor: index === metrics.monthlyGrowth.length - 1 ? '#28a745' : '#007bff',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '20px',
                  transition: 'height 0.5s ease',
                  opacity: 0.8
                }} />
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {month.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Customers */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#495057' }}>
          Top Performing Customers
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '15px'
        }}>
          {metrics.topPerformers.map((customer, index) => (
            <div key={customer.name} style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  fontWeight: '500', 
                  fontSize: '14px',
                  color: '#495057',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  marginRight: '10px'
                }}>
                  {customer.name}
                </span>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getGradeColor(customer.grade),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {customer.grade}
                </span>
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#28a745' 
              }}>
                ${customer.value.toLocaleString()}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#6c757d' 
              }}>
                #{index + 1} Customer Value
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}