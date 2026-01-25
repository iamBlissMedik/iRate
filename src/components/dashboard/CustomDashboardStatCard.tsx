/**
 * CustomDashboardStatCard - Dashboard statistic card component
 * Following Single Responsibility Principle (SRP) - displays a single stat
 * Following Interface Segregation Principle (ISP) - separate interfaces for business and UI props
 * Following Dependency Inversion Principle (DIP) - depends on BaseCard abstraction
 */

import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { StatCardUIProps } from '@/types/dashboard';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const trendIcons = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-zinc-500 dark:text-zinc-400',
};

export const CustomDashboardStatCard: React.FC<StatCardUIProps> = ({
  label,
  formattedValue,
  formattedChange,
  trend = 'neutral',
  icon,
}) => {
  const TrendIcon = trendIcons[trend];

  return (
    <BaseCard variant="bordered" padding="md">
      <div className="flex flex-col gap-3">
        {/* Header with label and icon */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {label}
          </p>
          {icon && (
            <div className="text-zinc-400 dark:text-zinc-600">
              {icon}
            </div>
          )}
        </div>

        {/* Main value */}
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formattedValue}
          </h3>

          {/* Change indicator */}
          {formattedChange && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trendColors[trend])}>
              <TrendIcon className="h-4 w-4" />
              <span>{formattedChange}</span>
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};
