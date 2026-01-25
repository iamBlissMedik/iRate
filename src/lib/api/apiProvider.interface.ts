/**
 * API Provider Interface
 * Following Interface Segregation Principle (ISP) and Dependency Inversion Principle (DIP)
 * This abstraction allows different implementations (mock, real, test, etc.)
 */

import { DashboardOverviewResponse } from '@/types/dashboard';

export interface DashboardApiProvider {
  getDashboardOverview(): Promise<DashboardOverviewResponse>;
}
