"use client";

import { ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ApiProvider } from "@irate/api-client/react";
import { ThemeProvider, Toaster, toast } from "@irate/ui";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  const onUnauthorized = useCallback(() => {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      router.replace("/login?session=expired");
    }
  }, [router]);

  const onError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  return (
    <ThemeProvider>
      <ApiProvider onUnauthorized={onUnauthorized} onError={onError}>
        {children}
        <Toaster />
      </ApiProvider>
    </ThemeProvider>
  );
}
