import '../styles/globals.css';
import Providers from './providers';
import { Inter } from 'next/font/google';
import EnhancedAssistant from '../src/components/EnhancedAssistant';
import SecurityInitializer from '../src/components/SecurityInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AsymmFlow - Intelligent Business Platform',
  description: 'Advanced ERP/CRM platform with intelligent automation, OneDrive integration, and AI-powered data processing.',
  keywords: 'ERP, CRM, Microsoft, OneDrive, AI, Business Intelligence, Enterprise, Automation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Security & Audit System Initialization */}
          <SecurityInitializer />
          {children}
          {/* Enhanced Assistant - Available site-wide */}
          <EnhancedAssistant />
        </Providers>
      </body>
    </html>
  );
}
