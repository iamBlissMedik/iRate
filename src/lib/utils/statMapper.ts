/**
 * Stat Mapper - transforms API data to card properties
 * Following Single Responsibility Principle (SRP) - dedicated to data transformation
 */

import { DashboardOverviewResponse, DashboardStatData, StatCardProps } from '@/types/dashboard';
import { formatNumber, formatCurrency, formatPercentage, getTrend } from './formatters';

/**
 * Maps raw dashboard data to structured stat data
 */
export const mapDashboardDataToStats = (
  data: DashboardOverviewResponse
): DashboardStatData[] => {
  return [
    {
      label: 'Total Users',
      value: data.totalUsers,
      change: data.userGrowth,
      trend: getTrend(data.userGrowth),
    },
    {
      label: 'Active Users',
      value: data.activeUsers,
      change: data.activeUserGrowth,
      trend: getTrend(data.activeUserGrowth),
    },
    {
      label: 'Revenue',
      value: data.revenue,
      change: data.revenueGrowth,
      trend: getTrend(data.revenueGrowth),
    },
    {
      label: 'Orders',
      value: data.orders,
      change: data.ordersGrowth,
      trend: getTrend(data.ordersGrowth),
    },
  ];
};

/**
 * Maps stat data to card props with proper formatting
 */
export const mapStatDataToCardProps = (stat: DashboardStatData): StatCardProps => {
  // Apply appropriate formatting based on the stat label
  const isRevenue = stat.label.toLowerCase().includes('revenue');
  const formattedValue = isRevenue ? formatCurrency(stat.value) : formatNumber(stat.value);
  
  const formattedChange = stat.change !== undefined ? formatPercentage(stat.change) : undefined;

  return {
    label: stat.label,
    value: formattedValue,
    change: formattedChange,
    trend: stat.trend,
  };
};
