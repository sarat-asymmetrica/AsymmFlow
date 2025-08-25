// ⛳ code-map: [anchor-id]
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [pupal]
declare module 'next-auth/react' {
  // Minimal stub for compile-time purposes only.
  export interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
    };
  }
  export function useSession(): { data: Session | null };
}
