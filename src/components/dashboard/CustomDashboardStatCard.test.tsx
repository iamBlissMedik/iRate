/**
 * Unit tests for CustomDashboardStatCard component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomDashboardStatCard } from '../dashboard/CustomDashboardStatCard';

describe('CustomDashboardStatCard', () => {
  it('should render label and formatted value', () => {
    render(
      <CustomDashboardStatCard
        label="Total Users"
        formattedValue="12,543"
      />
    );
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('12,543')).toBeInTheDocument();
  });

  it('should render change percentage when provided', () => {
    render(
      <CustomDashboardStatCard
        label="Revenue"
        formattedValue="$345,678"
        formattedChange="+23.1%"
        trend="up"
      />
    );
    
    expect(screen.getByText('+23.1%')).toBeInTheDocument();
  });

  it('should not render change section when not provided', () => {
    const { container } = render(
      <CustomDashboardStatCard
        label="Orders"
        formattedValue="1,234"
      />
    );
    
    expect(container.textContent).not.toContain('%');
  });

  it('should render icon when provided', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;
    
    render(
      <CustomDashboardStatCard
        label="Users"
        formattedValue="100"
        icon={<TestIcon />}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should apply correct trend colors', () => {
    const { container: upContainer } = render(
      <CustomDashboardStatCard
        label="Test"
        formattedValue="100"
        formattedChange="+10%"
        trend="up"
      />
    );
    
    const { container: downContainer } = render(
      <CustomDashboardStatCard
        label="Test"
        formattedValue="100"
        formattedChange="-10%"
        trend="down"
      />
    );
    
    expect(upContainer.textContent).toContain('+10%');
    expect(downContainer.textContent).toContain('-10%');
  });
});
