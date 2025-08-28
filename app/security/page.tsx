/**
 * Security & Audit Dashboard Page
 * SOC-2 audit readiness and security monitoring
 */

import SecurityDashboard from '../../src/components/SecurityDashboard';
import MainLayout from '../../components/layout/MainLayout';

export default function SecurityPage() {
  return (
    <MainLayout>
      <SecurityDashboard />
    </MainLayout>
  );
}

export const metadata = {
  title: 'Security & Audit Dashboard - AsymmFlow',
  description: 'Real-time security monitoring, audit trails, and SOC-2 compliance tracking for AsymmFlow ERP platform.',
};