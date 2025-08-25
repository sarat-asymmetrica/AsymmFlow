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

const inter = Inter({ subsets: ['latin'] });

// 🧬 bio-signal: app-metadata (SEO optimization)
export const metadata = {
  title: 'PrismFlow ERP/CRM - Enterprise Management Platform',
  description: 'Modern ERP/CRM platform with Microsoft Azure AD authentication and advanced business management features.',
  keywords: 'ERP, CRM, Microsoft, Azure AD, Business Management, Enterprise',
};

// 🔄 evolution-stage: [mature] - App Router root layout
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
        </Providers>
      </body>
    </html>
  );
}
