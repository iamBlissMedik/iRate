"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createQueryClient } from "./query-client";

export interface ApiProviderProps {
  children: ReactNode;
  /** Shows failed-query messages (apps pass `toast.error`). */
  onError?: (message: string) => void;
  /** Where to send the user when their session can no longer be refreshed. */
  loginPath?: string;
}

/**
 * React Query provider with one client per browser session.
 *
 * A 401 means the BFF could not refresh the session, so we hard-navigate to
 * the login page (dropping all in-memory state) and come back afterwards.
 */
export function ApiProvider({ children, onError, loginPath = "/login" }: ApiProviderProps) {
  const [client] = useState(() =>
    createQueryClient({
      onError: (message) => onError?.(message),
      onUnauthorized: () => {
        const { pathname, search } = window.location;
        if (pathname === loginPath) return;
        const params = new URLSearchParams({ session: "expired", from: pathname + search });
        window.location.assign(`${loginPath}?${params}`);
      },
    }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
