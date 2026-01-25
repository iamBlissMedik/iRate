/**
 * Main API module - public interface
 * Following Facade pattern to provide a simple interface to the complex subsystem
 */

import { ApiProviderFactory as Factory } from './apiProviderFactory';

export type { DashboardApiProvider } from './apiProvider.interface';
export { ApiProviderFactory } from './apiProviderFactory';
export { MockDashboardApiProvider } from './mockApiProvider';
export { RealDashboardApiProvider } from './realApiProvider';

// Convenience function for direct use
export const getDashboardOverview = async () => {
  const provider = Factory.getDashboardApiProvider();
  return provider.getDashboardOverview();
};
