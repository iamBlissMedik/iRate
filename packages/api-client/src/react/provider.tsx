"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createQueryClient, type CreateQueryClientOptions } from "./query-client";
import { setOnUnauthorized } from "../browser-client";

export interface ApiProviderProps extends CreateQueryClientOptions {
  children: ReactNode;
}

/**
 * Wraps the app in a React Query provider with a stable, per-render client and
 * wires the global 401 handler so an expired session redirects to login.
 */
export function ApiProvider({ children, onError, onUnauthorized }: ApiProviderProps) {
  const [client] = useState(() => {
    if (onUnauthorized) setOnUnauthorized(onUnauthorized);
    return createQueryClient({ onError, onUnauthorized });
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
