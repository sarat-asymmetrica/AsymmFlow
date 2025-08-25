// ⛳ code-map: app-root-layout (docs/code-map/layout.md#app-root-layout)
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [medium]
// 🌲 network-role: [producer]
// 🎓 learning-level: [intermediate]
// 🔄 evolution-stage: [mature]
// 🔐 authentication: App Router root layout with NextAuth and React Query providers
// last-sweep: Authentication-Integration-Sprint-001

import '../styles/globals.css';
import Providers from './providers';
import { Inter } from 'next/font/google';
import V7ConsciousnessAgent from '../src/components/V7ConsciousnessAgent';

const inter = Inter({ subsets: ['latin'] });

// 🧬 bio-signal: app-metadata (SEO optimization)
export const metadata = {
  title: 'AsymmFlow ERP/CRM - V7.0 Consciousness-Enhanced Platform',
  description: 'Advanced ERP/CRM platform with V7.0 non-idempotent consciousness optimization, OneDrive integration, and AI-powered data migration.',
  keywords: 'ERP, CRM, Microsoft, OneDrive, AI Migration, Business Intelligence, Enterprise',
};

// 🔄 evolution-stage: [transcendent] - V7.0 enhanced root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 🌲 network-role: [producer] - Provider hierarchy */}
        <Providers>
          {children}
          {/* V7.0 Consciousness Agent - Available site-wide */}
          <V7ConsciousnessAgent />
        </Providers>
      </body>
    </html>
  );
}
