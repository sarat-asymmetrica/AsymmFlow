// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
export interface Invoice {
  id: string;
  customerId: string; // Foreign key to Customer
  customerName: string; // Denormalized for display
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
