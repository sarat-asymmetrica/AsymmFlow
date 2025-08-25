'use client';

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { CompetitionIntelligenceDashboard } from '../../src/components/competition-intelligence-dashboard';

export default function CompetitionIntelligencePage() {
  return (
    <MainLayout>
      <CompetitionIntelligenceDashboard />
    </MainLayout>
  );
}