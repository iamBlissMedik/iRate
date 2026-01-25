/**
 * Real API Provider Implementation
 * Following Single Responsibility Principle (SRP) - only handles real API calls
 */

import { DashboardApiProvider } from './apiProvider.interface';
import { DashboardOverviewResponse } from '@/types/dashboard';
import { getApiConfig } from '../config/apiConfig';

export class RealDashboardApiProvider implements DashboardApiProvider {
  async getDashboardOverview(): Promise<DashboardOverviewResponse> {
    const config = getApiConfig();
    const url = `${config.baseUrl}/api/dashboard/overview`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
