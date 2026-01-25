/**
 * Unit tests for stat mapper utilities
 */

import { describe, it, expect } from 'vitest';
import {
  mapDashboardDataToStats,
  mapStatDataToCardProps,
} from '@/lib/utils/statMapper';
import { DashboardOverviewResponse } from '@/types/dashboard';

describe('mapDashboardDataToStats', () => {
  it('should map dashboard data to stat array', () => {
    const mockData: DashboardOverviewResponse = {
      totalUsers: 1000,
      activeUsers: 500,
      revenue: 50000,
      orders: 200,
      userGrowth: 10.5,
      activeUserGrowth: 5.2,
      revenueGrowth: 15.0,
      ordersGrowth: -2.1,
    };

    const stats = mapDashboardDataToStats(mockData);

    expect(stats).toHaveLength(4);
    expect(stats[0]).toEqual({
      label: 'Total Users',
      value: 1000,
      change: 10.5,
      trend: 'up',
    });
    expect(stats[1]).toEqual({
      label: 'Active Users',
      value: 500,
      change: 5.2,
      trend: 'up',
    });
    expect(stats[2]).toEqual({
      label: 'Revenue',
      value: 50000,
      change: 15.0,
      trend: 'up',
    });
    expect(stats[3]).toEqual({
      label: 'Orders',
      value: 200,
      change: -2.1,
      trend: 'down',
    });
  });

  it('should handle missing growth data', () => {
    const mockData: DashboardOverviewResponse = {
      totalUsers: 1000,
      activeUsers: 500,
      revenue: 50000,
      orders: 200,
    };

    const stats = mapDashboardDataToStats(mockData);

    expect(stats[0]).toEqual({
      label: 'Total Users',
      value: 1000,
      change: undefined,
      trend: 'neutral',
    });
  });
});

describe('mapStatDataToCardProps', () => {
  it('should format regular numbers with commas', () => {
    const stat = {
      label: 'Total Users',
      value: 12345,
      change: 10.5,
      trend: 'up' as const,
    };

    const props = mapStatDataToCardProps(stat);

    expect(props.label).toBe('Total Users');
    expect(props.value).toBe('12,345');
    expect(props.change).toBe('+10.5%');
    expect(props.trend).toBe('up');
  });

  it('should format revenue as currency', () => {
    const stat = {
      label: 'Revenue',
      value: 345678,
      change: 23.1,
      trend: 'up' as const,
    };

    const props = mapStatDataToCardProps(stat);

    expect(props.value).toBe('$345,678');
    expect(props.change).toBe('+23.1%');
  });

  it('should handle stats without change data', () => {
    const stat = {
      label: 'Orders',
      value: 1234,
      trend: 'neutral' as const,
    };

    const props = mapStatDataToCardProps(stat);

    expect(props.value).toBe('1,234');
    expect(props.change).toBeUndefined();
  });
});
