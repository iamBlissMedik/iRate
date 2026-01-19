/**
 * Currency Utilities
 *
 * Helper functions for formatting and manipulating currency values
 * Focused on Nigerian Naira (NGN)
 */

/**
 * Format amount as Nigerian Naira
 *
 * @param amount - The amount to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string (e.g., "₦50,000.00")
 */
export const formatNaira = (
  amount: number,
  options?: Intl.NumberFormatOptions,
): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};

/**
 * Format amount without currency symbol
 *
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "50,000.00")
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Parse formatted currency string to number
 *
 * @param value - The formatted string (e.g., "₦50,000.00" or "50,000.00")
 * @returns Parsed number
 */
export const parseCurrency = (value: string): number => {
  // Remove currency symbol, commas, and spaces
  const cleaned = value.replace(/[₦,\s]/g, "");
  return parseFloat(cleaned) || 0;
};

/**
 * Validate if amount is valid
 *
 * @param amount - The amount to validate
 * @returns True if valid, false otherwise
 */
export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount >= 0 && isFinite(amount);
};

/**
 * Format amount compactly (K, M notation)
 *
 * @param amount - The amount to format
 * @returns Compact format (e.g., "₦50K", "₦1.2M")
 */
export const formatNairaCompact = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }
  return formatNaira(amount);
};

/**
 * Add two monetary amounts safely (avoiding floating point errors)
 *
 * @param a - First amount
 * @param b - Second amount
 * @returns Sum
 */
export const addAmounts = (a: number, b: number): number => {
  return Math.round((a + b) * 100) / 100;
};

/**
 * Subtract two monetary amounts safely
 *
 * @param a - First amount
 * @param b - Amount to subtract
 * @returns Difference
 */
export const subtractAmounts = (a: number, b: number): number => {
  return Math.round((a - b) * 100) / 100;
};

/**
 * Calculate percentage of amount
 *
 * @param amount - Base amount
 * @param percentage - Percentage (e.g., 10 for 10%)
 * @returns Calculated percentage amount
 */
export const calculatePercentage = (
  amount: number,
  percentage: number,
): number => {
  return Math.round(((amount * percentage) / 100) * 100) / 100;
};

/**
 * Convert kobo to naira
 *
 * @param kobo - Amount in kobo
 * @returns Amount in naira
 */
export const koboToNaira = (kobo: number): number => {
  return kobo / 100;
};

/**
 * Convert naira to kobo
 *
 * @param naira - Amount in naira
 * @returns Amount in kobo
 */
export const nairaToKobo = (naira: number): number => {
  return Math.round(naira * 100);
};
