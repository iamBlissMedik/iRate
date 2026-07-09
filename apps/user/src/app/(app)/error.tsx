"use client";

import { useEffect } from "react";
import { ErrorState } from "@irate/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook for an error-tracking service (Sentry/LogRocket) — see observability seam.
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState
        title="This page hit a snag"
        description="We couldn't load this view. You can retry, or head back to your dashboard."
        onRetry={reset}
      />
    </div>
  );
}
