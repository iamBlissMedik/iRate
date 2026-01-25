/**
 * Data formatting utilities
 * Following Single Responsibility Principle (SRP) - each function has one clear purpose
 */

/**
 * Formats a number with locale-specific thousand separators
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a percentage change value
 */
export const formatPercentage = (value: number, includeSign: boolean = true): string => {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

/**
 * Determines trend direction from a percentage value
 */
export const getTrend = (value?: number): 'up' | 'down' | 'neutral' => {
  if (value === undefined || value === 0) return 'neutral';
  return value > 0 ? 'up' : 'down';
};
