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
    // Observability seam: report to an error tracker (Sentry, Datadog) here.
    console.error("[route error]", error);
  }, [error]);

  return (
    <ErrorState
      title="This page hit a snag"
      description="We couldn't load this view. Try again, or head back to your dashboard."
      onRetry={reset}
    />
  );
}
