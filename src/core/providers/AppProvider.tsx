/**
 * App Provider
 *
 * Wraps the application with all necessary providers
 * - Redux Provider
 * - React Query Provider
 * - Toast Provider
 * - Theme Provider
 */

"use client";

import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { store } from "@/core/store/store";
import { queryClient } from "@/core/query/query-client";
import { env } from "@/core/config/env";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ReduxProvider>
  );
};
