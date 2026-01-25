/**
 * Unit tests for DashboardStats component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '../dashboard/DashboardStats';
import { StatCardProps } from '@/types/dashboard';

describe('DashboardStats', () => {
  const mockStats: StatCardProps[] = [
    {
      label: 'Total Users',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
    },
    {
      label: 'Active Users',
      value: '8,932',
      change: '+8.3%',
      trend: 'up',
    },
    {
      label: 'Revenue',
      value: '$345,678',
      change: '+23.1%',
      trend: 'up',
    },
    {
      label: 'Orders',
      value: '1,234',
      change: '+15.7%',
      trend: 'up',
    },
  ];

  it('should render all stat cards', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<DashboardStats stats={[]} isLoading={true} />);
    
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements).toHaveLength(4);
  });

  it('should render error state', () => {
    const error = new Error('Failed to load data');
    
    render(<DashboardStats stats={[]} error={error} />);
    
    expect(screen.getByText('Error loading dashboard stats')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('should not render error when no error present', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.queryByText('Error loading dashboard stats')).not.toBeInTheDocument();
  });
});
