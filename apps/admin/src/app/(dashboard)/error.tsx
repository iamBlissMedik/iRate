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
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="p-6 lg:p-10">
      <ErrorState
        title="This view failed to load"
        description="Something went wrong fetching this data. You can retry."
        onRetry={reset}
      />
    </div>
  );
}
