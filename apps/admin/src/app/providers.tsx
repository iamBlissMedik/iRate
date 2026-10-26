"use client";

import type { ReactNode } from "react";
import { ApiProvider } from "@irate/api-client/react";
import { ThemeProvider, Toaster, toast } from "@irate/ui";

/** Client-side providers: theme, server state (React Query) and toasts. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ApiProvider onError={toast.error}>
        {children}
        <Toaster richColors closeButton />
      </ApiProvider>
    </ThemeProvider>
  );
}
