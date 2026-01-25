/**
 * Type definitions for dashboard domain
 * Centralized types following Interface Segregation Principle (ISP)
 */

export interface DashboardStatData {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DashboardOverviewResponse {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  orders: number;
  userGrowth?: number;
  activeUserGrowth?: number;
  revenueGrowth?: number;
  ordersGrowth?: number;
}

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface StatCardBusinessLogicProps {
  data: DashboardStatData;
}

export interface StatCardUIProps {
  label: string;
  formattedValue: string;
  formattedChange?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}
