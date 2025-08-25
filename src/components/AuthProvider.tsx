// ⛳ code-map: auth-provider (docs/code-map/auth.md#auth-provider)
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [low]
// 🌲 network-role: [guardian]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [mature]
// 🔐 authentication: NextAuth.js session provider wrapper
// last-sweep: Authentication-Integration-Sprint-001

'use client';

import React, { useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

// 🧬 bio-signal: session-provider (authentication context)
export default function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <>{children}</>;
  }

  // Use a simple wrapper since we're handling auth via middleware and direct API calls
  return <>{children}</>;
}
