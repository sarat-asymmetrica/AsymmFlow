// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `BHD ${amount.toLocaleString('en-BH', { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  })}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-BH');
}
