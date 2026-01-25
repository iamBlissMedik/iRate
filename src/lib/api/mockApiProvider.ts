/**
 * Mock API Provider Implementation
 * Following Single Responsibility Principle (SRP) - only handles mock data
 */

import { DashboardApiProvider } from './apiProvider.interface';
import { DashboardOverviewResponse } from '@/types/dashboard';

export class MockDashboardApiProvider implements DashboardApiProvider {
  private readonly mockDelay: number;

  constructor(mockDelay: number = 500) {
    this.mockDelay = mockDelay;
  }

  async getDashboardOverview(): Promise<DashboardOverviewResponse> {
    // Simulate network delay
    await this.delay(this.mockDelay);

    return {
      totalUsers: 12543,
      activeUsers: 8932,
      revenue: 345678,
      orders: 1234,
      userGrowth: 12.5,
      activeUserGrowth: 8.3,
      revenueGrowth: 23.1,
      ordersGrowth: 15.7,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
