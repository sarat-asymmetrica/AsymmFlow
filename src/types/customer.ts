// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
export interface Customer {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  
  // Advanced Business Intelligence Fields
  paymentGrade?: 'A' | 'B' | 'C' | 'D';
  averagePaymentDays?: number;
  totalOrderValue?: number;
  orderCount?: number;
  lastPaymentDate?: Date;
  creditLimit?: number;
  relationshipYears?: number;
  riskScore?: number;
  profitabilityIndex?: number;
  
  // Payment History Analytics
  paymentHistory?: PaymentRecord[];
  
  // Business Intelligence Insights
  predictedPaymentDays?: number;
  churnRisk?: number;
  lifetimeValue?: number;
  recommendedActions?: string[];
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  invoiceDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  amount: number;
  daysTaken?: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface CustomerGradeAnalysis {
  currentGrade: 'A' | 'B' | 'C' | 'D';
  previousGrade?: 'A' | 'B' | 'C' | 'D';
  gradeHistory: Array<{
    grade: 'A' | 'B' | 'C' | 'D';
    date: Date;
    reason: string;
  }>;
  confidenceLevel: number;
  recommendedActions: string[];
  riskFactors: string[];
  strengths: string[];
}
