"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { useTheme } from "next-themes";
import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";

/** Global toast portal. Render once at the app root, inside ThemeProvider. */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <SonnerToaster
      theme={(resolvedTheme as "light" | "dark") ?? "system"}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-lg border border-border bg-card text-card-foreground shadow-lg",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

/**
 * Typed toast helper used across the app. Centralizing it means every success /
 * error message looks consistent and we can route API errors through one place.
 */
export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description, icon: <CheckCircle2 className="size-4" /> }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description, icon: <XCircle className="size-4" /> }),
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, { description, icon: <TriangleAlert className="size-4" /> }),
  info: (message: string, description?: string) =>
    sonnerToast.info(message, { description, icon: <Info className="size-4" /> }),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
  raw: sonnerToast,
};
