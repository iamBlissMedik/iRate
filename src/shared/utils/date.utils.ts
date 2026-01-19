/**
 * Date Utilities
 *
 * Helper functions for formatting and manipulating dates
 */

/**
 * Format date to readable string
 *
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param format - Format type
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: "short" | "long" | "relative" = "short",
): string => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  switch (format) {
    case "short":
      // e.g., "Jan 15, 2024"
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    case "long":
      // e.g., "January 15, 2024 at 3:45 PM"
      return dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

    case "relative":
      return formatRelativeTime(dateObj);

    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

/**
 * Format time only
 *
 * @param date - Date to format
 * @returns Time string (e.g., "3:45 PM")
 */
export const formatTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Check if date is today
 *
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 *
 * @param date - Date to check
 * @returns True if date is yesterday
 */
export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get start of day
 *
 * @param date - Date
 * @returns Start of day
 */
export const startOfDay = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 *
 * @param date - Date
 * @returns End of day
 */
export const endOfDay = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Add days to date
 *
 * @param date - Base date
 * @param days - Number of days to add
 * @returns New date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from date
 *
 * @param date - Base date
 * @param days - Number of days to subtract
 * @returns New date
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};
