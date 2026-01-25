/**
 * DashboardStatsContainer - Container component for data fetching
 * Following Single Responsibility Principle (SRP) - handles data fetching and state management
 * Following Separation of Concerns - separates data logic from presentation
 */

'use client';

import React from 'react';
import { DashboardStats } from './DashboardStats';
import { useDashboardOverview } from '@/lib/hooks/overview.hooks';
import { mapDashboardDataToStats, mapStatDataToCardProps } from '@/lib/utils/statMapper';

export interface DashboardStatsContainerProps {
  // Callback for error handling - injected by parent
  onError?: (error: Error) => void;
}

export const DashboardStatsContainer: React.FC<DashboardStatsContainerProps> = ({
  onError,
}) => {
  // Use the hook with callback injection for error handling
  const { data, isLoading, error } = useDashboardOverview({
    onError,
  });

  // Transform data using mapper functions
  const stats = data 
    ? mapDashboardDataToStats(data).map(mapStatDataToCardProps)
    : [];

  return (
    <DashboardStats
      stats={stats}
      isLoading={isLoading}
      error={error}
    />
  );
};
