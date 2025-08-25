// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
export interface Order {
  id: string;
  orderRef: string;
  customerId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  quotationId?: string;
  opportunityId?: string;
  orderDate?: string;
}
