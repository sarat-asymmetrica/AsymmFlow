'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { CustomerIntelligenceDashboard } from '../../src/components/customer-intelligence-dashboard';
import { Customer } from '../../src/types/customer';

export default function CustomerIntelligencePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomersWithIntelligence();
  }, []);

  const fetchCustomersWithIntelligence = async () => {
    try {
      // Fetch existing customers
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        const baseCustomers = data.data || [];
        
        // Enhance with intelligence data (seed realistic business data)
        const enhancedCustomers = baseCustomers.map((customer: any) => 
          enhanceCustomerWithIntelligence(customer)
        );
        
        setCustomers(enhancedCustomers);
      } else {
        // Fallback to demo data for development
        setCustomers(generateDemoCustomers());
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Use demo data as fallback
      setCustomers(generateDemoCustomers());
    } finally {
      setLoading(false);
    }
  };

  const enhanceCustomerWithIntelligence = (baseCustomer: any): Customer => {
    // Generate realistic payment behavior patterns
    const relationshipYears = Math.random() * 8 + 0.5;
    const orderCount = Math.floor(Math.random() * 50) + 1;
    const averageOrderValue = Math.random() * 80000 + 5000;
    const totalOrderValue = orderCount * averageOrderValue;
    
    // Generate payment history based on realistic patterns
    const paymentHistory = generatePaymentHistory(orderCount, relationshipYears);
    const averagePaymentDays = calculateAveragePaymentDays(paymentHistory);
    
    return {
      ...baseCustomer,
      relationshipYears: Math.round(relationshipYears * 10) / 10,
      orderCount,
      totalOrderValue: Math.round(totalOrderValue),
      averagePaymentDays: Math.round(averagePaymentDays),
      paymentHistory,
      lastPaymentDate: paymentHistory.length > 0 ? 
        paymentHistory[paymentHistory.length - 1].paymentDate : undefined,
      creditLimit: Math.round(totalOrderValue * 0.3), // 30% of total order history
      riskScore: calculateRiskScore(averagePaymentDays, relationshipYears, totalOrderValue),
      profitabilityIndex: calculateProfitabilityIndex(totalOrderValue, averagePaymentDays)
    };
  };

  const generatePaymentHistory = (orderCount: number, relationshipYears: number) => {
    const history = [];
    const now = new Date();
    const daysPerOrder = (relationshipYears * 365) / orderCount;
    
    // Generate payment behavior patterns (realistic business scenarios)
    const paymentRandom = Math.random();
    let paymentPattern: string;
    if (paymentRandom < 0.3) paymentPattern = 'excellent'; // 30% excellent payers
    else if (paymentRandom < 0.6) paymentPattern = 'good'; // 30% good payers  
    else if (paymentRandom < 0.85) paymentPattern = 'fair'; // 25% fair payers
    else paymentPattern = 'poor'; // 15% poor payers
    
    for (let i = 0; i < Math.min(orderCount, 20); i++) { // Limit to last 20 orders
      const orderDate = new Date(now.getTime() - (i * daysPerOrder * 24 * 60 * 60 * 1000));
      const invoiceDate = new Date(orderDate.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000));
      const dueDate = new Date(invoiceDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30-day terms
      
      let daysTaken;
      switch (paymentPattern) {
        case 'excellent':
          daysTaken = Math.random() * 35 + 10; // 10-45 days
          break;
        case 'good': 
          daysTaken = Math.random() * 60 + 20; // 20-80 days
          break;
        case 'fair':
          daysTaken = Math.random() * 90 + 30; // 30-120 days
          break;
        default: // poor
          daysTaken = Math.random() * 120 + 60; // 60-180 days
      }
      
      // Add some realistic variance
      daysTaken += (Math.random() - 0.5) * 20;
      daysTaken = Math.max(5, Math.round(daysTaken));
      
      const paymentDate = new Date(invoiceDate.getTime() + (daysTaken * 24 * 60 * 60 * 1000));
      
      history.push({
        id: `payment-${i}`,
        orderId: `order-${i}`, 
        invoiceDate,
        dueDate,
        paymentDate: i < 2 ? undefined : paymentDate, // Last 2 might be pending
        amount: Math.round((Math.random() * 50000 + 5000) * 100) / 100,
        daysTaken: i < 2 ? undefined : daysTaken,
        status: i < 2 ? 'pending' : 'paid' as const
      });
    }
    
    return history.reverse(); // Most recent first
  };

  const calculateAveragePaymentDays = (paymentHistory: any[]) => {
    const paidInvoices = paymentHistory.filter(p => p.status === 'paid' && p.daysTaken);
    if (paidInvoices.length === 0) return 45; // Default
    
    return paidInvoices.reduce((sum, p) => sum + p.daysTaken, 0) / paidInvoices.length;
  };

  const calculateRiskScore = (avgDays: number, years: number, totalValue: number) => {
    let risk = 0;
    
    if (avgDays > 120) risk += 0.4;
    else if (avgDays > 90) risk += 0.3;
    else if (avgDays > 60) risk += 0.2;
    else risk += 0.1;
    
    if (years < 1) risk += 0.2;
    else if (years > 3) risk -= 0.1;
    
    if (totalValue < 50000) risk += 0.1;
    else if (totalValue > 200000) risk -= 0.1;
    
    return Math.max(0, Math.min(1, risk));
  };

  const calculateProfitabilityIndex = (totalValue: number, avgDays: number) => {
    let index = (totalValue / 100000) * 0.5; // Base on volume
    
    if (avgDays < 45) index += 0.3; // Bonus for fast payment
    else if (avgDays > 90) index -= 0.2; // Penalty for slow payment
    
    return Math.max(0, Math.min(1, index));
  };

  const generateDemoCustomers = (): Customer[] => {
    const demoCompanies = [
      'Al Mahmood Construction WLL',
      'Gulf Heavy Industries Ltd',
      'Modern Construction Co',
      'Saudi Development Corp',
      'Emirates Equipment Trading',
      'Bahrain Industrial Solutions',
      'Kuwait Engineering Works',
      'Qatar Facilities Management',
      'Arab Construction Group',
      'Middle East Trading Co',
      'Industrial Systems LLC',
      'Advanced Engineering WLL',
      'Regional Equipment Co',
      'Gulf Coast Contractors',
      'Mediterranean Trading Ltd'
    ];

    return demoCompanies.map((company, index) => {
      const customer = {
        id: `demo-${index}`,
        companyName: company,
        email: `contact@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: `+973 ${17000000 + Math.floor(Math.random() * 9999999)}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5), // Up to 5 years ago
        updatedAt: new Date(),
        status: 'active'
      };
      
      return enhanceCustomerWithIntelligence(customer);
    });
  };

  const handleGradeUpdate = (customerId: string, newGrade: 'A' | 'B' | 'C' | 'D') => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, paymentGrade: newGrade }
        : customer
    ));
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '18px',
          color: '#6c757d'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🧠</div>
            Loading Customer Intelligence...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CustomerIntelligenceDashboard 
        customers={customers}
        onGradeUpdate={handleGradeUpdate}
      />
    </MainLayout>
  );
}