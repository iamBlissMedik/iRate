/**
 * Unit tests for data formatting utilities
 */

import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  getTrend,
} from '@/lib/utils/formatters';

describe('formatNumber', () => {
  it('should format numbers with locale-specific thousand separators', () => {
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatCurrency', () => {
  it('should format numbers as USD currency by default', () => {
    expect(formatCurrency(1234)).toBe('$1,234');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('should handle zero and negative values', () => {
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(-100)).toBe('-$100');
  });

  it('should accept custom currency codes', () => {
    expect(formatCurrency(1234, 'EUR')).toBe('€1,234');
  });
});

describe('formatPercentage', () => {
  it('should format positive percentages with plus sign by default', () => {
    expect(formatPercentage(12.5)).toBe('+12.5%');
    expect(formatPercentage(0.3)).toBe('+0.3%');
  });

  it('should format negative percentages without changing sign', () => {
    expect(formatPercentage(-5.2)).toBe('-5.2%');
  });

  it('should format zero without sign', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should respect includeSign parameter', () => {
    expect(formatPercentage(12.5, false)).toBe('12.5%');
    expect(formatPercentage(-5.2, false)).toBe('-5.2%');
  });
});

describe('getTrend', () => {
  it('should return "up" for positive values', () => {
    expect(getTrend(10)).toBe('up');
    expect(getTrend(0.1)).toBe('up');
  });

  it('should return "down" for negative values', () => {
    expect(getTrend(-10)).toBe('down');
    expect(getTrend(-0.1)).toBe('down');
  });

  it('should return "neutral" for zero or undefined', () => {
    expect(getTrend(0)).toBe('neutral');
    expect(getTrend(undefined)).toBe('neutral');
  });
});
