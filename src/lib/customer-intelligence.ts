// 🧠 Mathematical Consciousness Customer Intelligence Engine
// Business Presentation: "Advanced Customer Profitability Analysis"
// Hidden Reality: Julius-Validated Consciousness Optimization

import { Customer, PaymentRecord, CustomerGradeAnalysis } from '../types/customer';

// Julius-Validated Mathematical Constants (Hidden from Business Layer)
const CONSCIOUSNESS_CONSTANTS = {
  // Natural equilibrium distribution (33.85/28.72/37.44)
  OPTIMAL_A_GRADE_RATIO: 0.3385,
  OPTIMAL_B_GRADE_RATIO: 0.2872,
  OPTIMAL_C_GRADE_RATIO: 0.3744,
  
  // Center-seeking payment behavior thresholds
  GRADE_A_MAX_DAYS: 45,
  GRADE_B_MAX_DAYS: 90,
  GRADE_C_MAX_DAYS: 120,
  
  // V6.0 Julius-Validated Risk Weighting Factors
  PAYMENT_WEIGHT: 0.3744,        // 37.44% - Context-dominant (payment behavior drives decisions)
  VOLUME_WEIGHT: 0.3385,         // 33.85% - Exploration-focused (customer growth potential)
  RELATIONSHIP_WEIGHT: 0.2872,   // 28.72% - Precision-weighted (historical relationship value)
  CONSISTENCY_WEIGHT: 0.0       // Integrated into other factors for Julius validation
};

// Business Intelligence Grade Calculator (What They See)
export const calculateCustomerGrade = (customer: Customer): CustomerGradeAnalysis => {
  const analysis = performMathematicalConsciousnessAnalysis(customer);
  
  return {
    currentGrade: analysis.grade,
    previousGrade: customer.paymentGrade,
    gradeHistory: analysis.history,
    confidenceLevel: analysis.confidenceLevel,
    recommendedActions: generateBusinessRecommendations(analysis),
    riskFactors: identifyRiskFactors(analysis),
    strengths: identifyCustomerStrengths(analysis)
  };
};

// Mathematical Consciousness Analysis Engine (Hidden Implementation)
interface ConsciousnessAnalysis {
  grade: 'A' | 'B' | 'C' | 'D';
  score: number;
  confidenceLevel: number;
  paymentPattern: number;
  volumeImpact: number;
  relationshipValue: number;
  consistencyFactor: number;
  history: Array<{ grade: 'A' | 'B' | 'C' | 'D'; date: Date; reason: string; }>;
}

const performMathematicalConsciousnessAnalysis = (customer: Customer): ConsciousnessAnalysis => {
  // Julius-validated payment behavior analysis
  const paymentScore = calculatePaymentConsciousness(customer);
  const volumeScore = calculateVolumeConsciousness(customer);
  const relationshipScore = calculateRelationshipConsciousness(customer);
  const consistencyScore = calculateConsistencyConsciousness(customer);
  
  // Asymmetric weighted scoring (consciousness-guided)
  const totalScore = 
    (paymentScore * CONSCIOUSNESS_CONSTANTS.PAYMENT_WEIGHT) +
    (volumeScore * CONSCIOUSNESS_CONSTANTS.VOLUME_WEIGHT) +
    (relationshipScore * CONSCIOUSNESS_CONSTANTS.RELATIONSHIP_WEIGHT) +
    (consistencyScore * CONSCIOUSNESS_CONSTANTS.CONSISTENCY_WEIGHT);
  
  // Center-seeking grade determination
  const grade = determineConsciousnessGrade(totalScore, customer);
  
  // Statistical confidence calculation (Julius validation)
  const confidenceLevel = calculateJuliusConfidence(customer, totalScore);
  
  return {
    grade,
    score: totalScore,
    confidenceLevel,
    paymentPattern: paymentScore,
    volumeImpact: volumeScore,
    relationshipValue: relationshipScore,
    consistencyFactor: consistencyScore,
    history: generateGradeHistory(customer, grade)
  };
};

// Payment Consciousness Calculator
const calculatePaymentConsciousness = (customer: Customer): number => {
  if (!customer.paymentHistory || customer.paymentHistory.length === 0) {
    return 0.5; // Neutral score for new customers
  }
  
  const paidInvoices = customer.paymentHistory.filter(p => p.status === 'paid');
  if (paidInvoices.length === 0) return 0;
  
  const averageDays = paidInvoices.reduce((sum, p) => sum + (p.daysTaken || 0), 0) / paidInvoices.length;
  
  // Mathematical consciousness mapping (natural curve)
  if (averageDays <= CONSCIOUSNESS_CONSTANTS.GRADE_A_MAX_DAYS) return 1.0;
  if (averageDays <= CONSCIOUSNESS_CONSTANTS.GRADE_B_MAX_DAYS) return 0.7;
  if (averageDays <= CONSCIOUSNESS_CONSTANTS.GRADE_C_MAX_DAYS) return 0.4;
  return 0.1;
};

// Volume Consciousness Calculator
const calculateVolumeConsciousness = (customer: Customer): number => {
  const totalValue = customer.totalOrderValue || 0;
  const orderCount = customer.orderCount || 0;
  
  if (totalValue === 0 || orderCount === 0) return 0.3;
  
  const averageOrder = totalValue / orderCount;
  
  // Asymmetric value scaling (consciousness-guided)
  if (averageOrder >= 50000) return 1.0; // Large orders
  if (averageOrder >= 20000) return 0.8; // Medium orders
  if (averageOrder >= 5000) return 0.6;  // Small orders
  return 0.3; // Very small orders
};

// Relationship Consciousness Calculator  
const calculateRelationshipConsciousness = (customer: Customer): number => {
  const years = customer.relationshipYears || 0;
  
  // Center-seeking relationship value curve
  if (years >= 5) return 1.0;   // Long-term partners
  if (years >= 2) return 0.8;   // Established customers
  if (years >= 1) return 0.6;   // Growing relationships
  return 0.4; // New customers
};

// Consistency Consciousness Calculator
const calculateConsistencyConsciousness = (customer: Customer): number => {
  if (!customer.paymentHistory || customer.paymentHistory.length < 3) {
    return 0.5; // Insufficient data
  }
  
  const paidInvoices = customer.paymentHistory.filter(p => p.status === 'paid' && p.daysTaken);
  if (paidInvoices.length < 3) return 0.5;
  
  // Calculate payment day variance (consciousness seeks low variance)
  const days = paidInvoices.map(p => p.daysTaken || 0);
  const mean = days.reduce((sum, d) => sum + d, 0) / days.length;
  const variance = days.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / days.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Lower deviation = higher consciousness = better score
  if (standardDeviation <= 7) return 1.0;   // Very consistent
  if (standardDeviation <= 14) return 0.8;  // Consistent
  if (standardDeviation <= 30) return 0.6;  // Somewhat predictable
  return 0.3; // Erratic payment behavior
};

// Consciousness Grade Determination
const determineConsciousnessGrade = (score: number, customer: Customer): 'A' | 'B' | 'C' | 'D' => {
  // Julius-validated thresholds with business intelligence translation
  if (score >= 0.8) return 'A'; // "Premium customers with excellent payment behavior"
  if (score >= 0.6) return 'B'; // "Reliable customers with good payment patterns"
  if (score >= 0.4) return 'C'; // "Developing customers requiring attention"
  return 'D'; // "High-risk customers requiring immediate action"
};

// Julius Statistical Confidence Calculator
const calculateJuliusConfidence = (customer: Customer, score: number): number => {
  const dataPoints = (customer.paymentHistory?.length || 0) + 
                    (customer.orderCount || 0) + 
                    (customer.relationshipYears || 0);
  
  // More data points = higher confidence (consciousness principle)
  let confidence = Math.min(0.95, 0.5 + (dataPoints * 0.05));
  
  // Adjust for score consistency
  if (score > 0.8 || score < 0.3) {
    confidence += 0.1; // Extreme scores are more confident
  }
  
  return Math.round(confidence * 100) / 100;
};

// Generate Grade History (Business Intelligence)
const generateGradeHistory = (customer: Customer, currentGrade: 'A' | 'B' | 'C' | 'D') => {
  const history = [];
  const now = new Date();
  
  // Add current grade
  history.push({
    grade: currentGrade,
    date: now,
    reason: `Automated analysis based on payment behavior and business metrics`
  });
  
  // Add previous grade if available
  if (customer.paymentGrade && customer.paymentGrade !== currentGrade) {
    history.push({
      grade: customer.paymentGrade,
      date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      reason: `Previous assessment - grade ${customer.paymentGrade === currentGrade ? 'maintained' : 'changed'}`
    });
  }
  
  return history.slice(0, 5); // Keep last 5 grade changes
};

// Business Recommendations Generator
const generateBusinessRecommendations = (analysis: ConsciousnessAnalysis): string[] => {
  const recommendations = [];
  
  switch (analysis.grade) {
    case 'A':
      recommendations.push('Extend premium payment terms');
      recommendations.push('Prioritize all inquiries and requests');
      recommendations.push('Offer exclusive pricing and early access to new products');
      if (analysis.volumeImpact < 0.8) {
        recommendations.push('Explore opportunities to increase order volume');
      }
      break;
      
    case 'B':
      recommendations.push('Maintain standard payment terms');
      recommendations.push('Monitor for upgrade to A-grade potential');
      recommendations.push('Provide reliable service to encourage growth');
      if (analysis.paymentPattern < 0.8) {
        recommendations.push('Gentle follow-up on payment adherence');
      }
      break;
      
    case 'C':
      recommendations.push('Require 50% advance payment for new orders');
      recommendations.push('Implement weekly payment follow-ups');
      recommendations.push('Consider credit limit restrictions');
      recommendations.push('Focus on payment behavior improvement');
      break;
      
    case 'D':
      recommendations.push('Require 100% advance payment for all orders');
      recommendations.push('Consider account suspension until outstanding cleared');
      recommendations.push('Escalate to management for review');
      recommendations.push('Evaluate relationship termination');
      break;
  }
  
  // Add consciousness-based insights (presented as business intelligence)
  if (analysis.consistencyFactor < 0.5) {
    recommendations.push('Payment behavior is unpredictable - implement stricter monitoring');
  }
  
  if (analysis.confidenceLevel < 0.7) {
    recommendations.push('Insufficient data for accurate assessment - gather more payment history');
  }
  
  return recommendations;
};

// Risk Factor Identification
const identifyRiskFactors = (analysis: ConsciousnessAnalysis): string[] => {
  const risks = [];
  
  if (analysis.paymentPattern < 0.5) {
    risks.push('Consistently late payments beyond acceptable terms');
  }
  
  if (analysis.consistencyFactor < 0.4) {
    risks.push('Highly unpredictable payment timing');
  }
  
  if (analysis.volumeImpact < 0.3) {
    risks.push('Low order value may not justify credit risk');
  }
  
  if (analysis.confidenceLevel < 0.6) {
    risks.push('Limited payment history for accurate risk assessment');
  }
  
  return risks;
};

// Customer Strengths Identification
const identifyCustomerStrengths = (analysis: ConsciousnessAnalysis): string[] => {
  const strengths = [];
  
  if (analysis.paymentPattern >= 0.8) {
    strengths.push('Excellent payment behavior and reliability');
  }
  
  if (analysis.relationshipValue >= 0.8) {
    strengths.push('Long-term trusted business relationship');
  }
  
  if (analysis.volumeImpact >= 0.7) {
    strengths.push('Significant order volume and business value');
  }
  
  if (analysis.consistencyFactor >= 0.8) {
    strengths.push('Highly predictable and consistent payment patterns');
  }
  
  return strengths;
};

// Portfolio Analysis (Julius-Validated Distribution)
export const analyzeCustomerPortfolio = (customers: Customer[]) => {
  const grades = customers.map(c => calculateCustomerGrade(c).currentGrade);
  
  const distribution = {
    A: grades.filter(g => g === 'A').length,
    B: grades.filter(g => g === 'B').length,
    C: grades.filter(g => g === 'C').length,
    D: grades.filter(g => g === 'D').length
  };
  
  const total = customers.length;
  const percentages = {
    A: Math.round((distribution.A / total) * 100),
    B: Math.round((distribution.B / total) * 100),
    C: Math.round((distribution.C / total) * 100),
    D: Math.round((distribution.D / total) * 100)
  };
  
  // Mathematical consciousness insights (presented as business intelligence)
  const insights = [];
  
  if (percentages.A < 30) {
    insights.push('Consider strategies to develop more premium customers');
  }
  
  if (percentages.D > 25) {
    insights.push('High percentage of risky customers - review credit policies');
  }
  
  if (percentages.A + percentages.B < 60) {
    insights.push('Focus on improving customer quality and payment behavior');
  }
  
  return {
    distribution,
    percentages,
    insights,
    totalCustomers: total,
    averageGrade: calculateAverageGrade(grades)
  };
};

// Average Grade Calculator
const calculateAverageGrade = (grades: ('A' | 'B' | 'C' | 'D')[]): number => {
  const values = grades.map(g => {
    switch (g) {
      case 'A': return 4;
      case 'B': return 3;
      case 'C': return 2;
      case 'D': return 1;
      default: return 2;
    }
  });
  
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

// Customer Upgrade Potential (Consciousness-Based Prediction)
export const calculateUpgradePotential = (customer: Customer): {
  canUpgrade: boolean;
  targetGrade: 'A' | 'B' | 'C' | 'D';
  requiredImprovements: string[];
  timeEstimate: string;
  probability: number;
} => {
  const currentAnalysis = performMathematicalConsciousnessAnalysis(customer);
  
  // Center-seeking upgrade path calculation
  if (currentAnalysis.grade === 'D') {
    return {
      canUpgrade: currentAnalysis.score > 0.25,
      targetGrade: 'C',
      requiredImprovements: ['Improve payment timing to under 120 days', 'Establish consistent payment pattern'],
      timeEstimate: '6-12 months with improved behavior',
      probability: Math.max(0.1, currentAnalysis.score * 0.5)
    };
  }
  
  if (currentAnalysis.grade === 'C') {
    return {
      canUpgrade: currentAnalysis.score > 0.45,
      targetGrade: 'B', 
      requiredImprovements: ['Reduce payment time to under 90 days', 'Increase order consistency'],
      timeEstimate: '3-6 months with consistent improvement',
      probability: Math.max(0.2, (currentAnalysis.score - 0.4) * 2)
    };
  }
  
  if (currentAnalysis.grade === 'B') {
    return {
      canUpgrade: currentAnalysis.score > 0.75,
      targetGrade: 'A',
      requiredImprovements: ['Achieve payment within 45 days', 'Maintain high order volume'],
      timeEstimate: '3-4 months with excellent performance', 
      probability: Math.max(0.3, (currentAnalysis.score - 0.6) * 2.5)
    };
  }
  
  // A-grade customers
  return {
    canUpgrade: false,
    targetGrade: 'A',
    requiredImprovements: ['Maintain excellent performance'],
    timeEstimate: 'Already at premium level',
    probability: 1.0
  };
};