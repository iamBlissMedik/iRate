/**
 * BaseCard - Reusable card layout component
 * Following Single Responsibility Principle (SRP) - handles only card layout and styling
 * Following Open/Closed Principle (OCP) - open for extension, closed for modification
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'elevated';
}

const paddingVariants = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const cardVariants = {
  default: 'bg-white dark:bg-zinc-900',
  bordered: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
  elevated: 'bg-white dark:bg-zinc-900 shadow-md',
};

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className,
  padding = 'md',
  variant = 'bordered',
}) => {
  return (
    <div
      className={cn(
        'rounded-lg',
        paddingVariants[padding],
        cardVariants[variant],
        className
      )}
    >
      {children}
    </div>
  );
};
