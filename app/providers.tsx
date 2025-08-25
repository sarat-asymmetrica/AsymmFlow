// ⛳ code-map: app-providers (docs/code-map/layout.md#app-providers)
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [intermediate]
// 🔄 evolution-stage: [mature]
// 🔐 authentication: Client-side providers wrapper for App Router
// last-sweep: Authentication-Integration-Sprint-001

'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: React.ReactNode;
}

// 🧬 bio-signal: providers-wrapper (client-side provider management)
export default function Providers({ children }: ProvidersProps) {
  // 🌊 energy-cost: [low] - Create React Query client on client-side
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
