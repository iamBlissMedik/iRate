/**
 * Optimization Hooks
 *
 * Custom hooks for performance optimization
 */

import { useRef, useEffect, useCallback, useState } from "react";

/**
 * useDebounce - Debounce a value
 *
 * Useful for search inputs, API calls, etc.
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle - Throttle a function call
 *
 * Useful for scroll handlers, resize handlers, etc.
 *
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 500,
): ((...args: Parameters<T>) => void) => {
  const lastRun = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay],
  );
};

/**
 * usePrevious - Get previous value
 *
 * Useful for comparing with current value
 *
 * @param value - Current value
 * @returns Previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const [prev, setPrev] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrev(value);
  }, [value]);

  return prev;
};

/**
 * useLocalStorage - Sync state with localStorage
 *
 * @param key - LocalStorage key
 * @param initialValue - Initial value
 * @returns [value, setValue, removeValue]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
