/**
 * Admin Context
 *
 * Context API for admin panel configuration and settings
 * This is better suited for Context API than Redux because:
 * - Scoped to admin area only
 * - Settings don't need to be shared globally
 * - Reduces Redux boilerplate for feature-specific state
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

/**
 * Admin Panel Configuration
 */
interface AdminConfig {
  // View preferences
  tablePageSize: number;
  compactView: boolean;
  showFilters: boolean;

  // Filters
  userFilter: "all" | "verified" | "unverified";
  kycStatusFilter: "all" | "pending" | "approved" | "rejected";
  dateRange: { from: Date | null; to: Date | null };
}

interface AdminContextValue {
  config: AdminConfig;
  updateConfig: (updates: Partial<AdminConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: AdminConfig = {
  tablePageSize: 20,
  compactView: false,
  showFilters: true,
  userFilter: "all",
  kycStatusFilter: "all",
  dateRange: { from: null, to: null },
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

/**
 * Admin Context Provider
 */
interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [config, setConfig] = useState<AdminConfig>(defaultConfig);

  // Memoize callbacks to prevent unnecessary re-renders
  const updateConfig = useCallback((updates: Partial<AdminConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      config,
      updateConfig,
      resetConfig,
    }),
    [config, updateConfig, resetConfig],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

/**
 * Hook to use Admin Context
 */
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within AdminProvider");
  }
  return context;
};
