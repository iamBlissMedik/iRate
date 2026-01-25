/**
 * API Provider Factory
 * Following Open/Closed Principle (OCP) and Dependency Inversion Principle (DIP)
 * Factory pattern allows easy extension with new providers without modifying existing code
 */

import { DashboardApiProvider } from './apiProvider.interface';
import { MockDashboardApiProvider } from './mockApiProvider';
import { RealDashboardApiProvider } from './realApiProvider';
import { getApiConfig } from '../config/apiConfig';

export class ApiProviderFactory {
  private static providers: Map<string, DashboardApiProvider> = new Map();

  static getDashboardApiProvider(): DashboardApiProvider {
    const config = getApiConfig();
    const mode = config.mode;

    // Singleton pattern - reuse existing provider instance
    if (!this.providers.has(mode)) {
      const provider = this.createProvider(mode);
      this.providers.set(mode, provider);
    }

    return this.providers.get(mode)!;
  }

  private static createProvider(mode: string): DashboardApiProvider {
    switch (mode) {
      case 'mock':
        return new MockDashboardApiProvider();
      case 'real':
        return new RealDashboardApiProvider();
      default:
        // Default to mock for safety
        console.warn(`Unknown API mode: ${mode}. Falling back to mock.`);
        return new MockDashboardApiProvider();
    }
  }

  // For testing purposes - clear cached providers
  static clearCache(): void {
    this.providers.clear();
  }
}
