/**
 * DashboardStats - Presentation component
 * Following Single Responsibility Principle (SRP) - only responsible for rendering
 * Following Dependency Inversion Principle (DIP) - depends on abstractions (props interface)
 */

import React from 'react';
import { CustomDashboardStatCard } from './CustomDashboardStatCard';
import { StatCardProps } from '@/types/dashboard';
import { Users, UserCheck, DollarSign, ShoppingCart } from 'lucide-react';

export interface DashboardStatsProps {
  stats: StatCardProps[];
  isLoading?: boolean;
  error?: Error | null;
}

const statIcons: Record<string, React.ReactNode> = {
  'Total Users': <Users className="h-5 w-5" />,
  'Active Users': <UserCheck className="h-5 w-5" />,
  'Revenue': <DollarSign className="h-5 w-5" />,
  'Orders': <ShoppingCart className="h-5 w-5" />,
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          Error loading dashboard stats
        </p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <CustomDashboardStatCard
          key={stat.label}
          label={stat.label}
          formattedValue={stat.value}
          formattedChange={stat.change}
          trend={stat.trend}
          icon={statIcons[stat.label]}
        />
      ))}
    </div>
  );
};
