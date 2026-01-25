/**
 * Unit tests for Mock API Provider
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDashboardApiProvider } from '../api/mockApiProvider';

describe('MockDashboardApiProvider', () => {
  let provider: MockDashboardApiProvider;

  beforeEach(() => {
    provider = new MockDashboardApiProvider(0); // No delay for tests
  });

  it('should return mock dashboard data', async () => {
    const data = await provider.getDashboardOverview();

    expect(data).toBeDefined();
    expect(data.totalUsers).toBe(12543);
    expect(data.activeUsers).toBe(8932);
    expect(data.revenue).toBe(345678);
    expect(data.orders).toBe(1234);
  });

  it('should include growth percentages', async () => {
    const data = await provider.getDashboardOverview();

    expect(data.userGrowth).toBe(12.5);
    expect(data.activeUserGrowth).toBe(8.3);
    expect(data.revenueGrowth).toBe(23.1);
    expect(data.ordersGrowth).toBe(15.7);
  });

  it('should simulate delay when configured', async () => {
    const delayedProvider = new MockDashboardApiProvider(100);
    const startTime = Date.now();
    
    await delayedProvider.getDashboardOverview();
    
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });
});
