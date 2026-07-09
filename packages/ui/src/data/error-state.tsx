"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "../primitives/button";
import { cn } from "../lib/cn";

/**
 * Reusable error fallback — used by route `error.tsx` boundaries and inline
 * query-error states. Keeps failure UX consistent across both apps.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCw className="size-4" /> {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
