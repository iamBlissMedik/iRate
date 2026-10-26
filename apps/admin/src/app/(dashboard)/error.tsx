"use client";

import { useEffect } from "react";
import { ErrorState } from "@irate/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Observability seam: report to an error tracker (Sentry, Datadog) here.
    console.error("[route error]", error);
  }, [error]);

  return (
    <ErrorState
      title="This view failed to load"
      description="Something went wrong fetching this data. Try again."
      onRetry={reset}
    />
  );
}
