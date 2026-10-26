"use client";

import type { KYCStatus } from "@irate/contracts";
import { useAdminKyc } from "@irate/api-client/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@irate/ui";
import { DonutChart } from "@irate/ui/charts";

const STATUSES: { status: KYCStatus; label: string; color: string }[] = [
  { status: "PENDING", label: "Pending", color: "var(--color-warning)" },
  { status: "VERIFIED", label: "Verified", color: "var(--color-success)" },
  { status: "REJECTED", label: "Rejected", color: "var(--color-destructive)" },
];

/** Exact count per status, read from each list's pagination total (one row fetched each). */
function useKycTotal(status: KYCStatus) {
  const { data, isLoading } = useAdminKyc({ status, page: 1, limit: 1 });
  return { total: data?.pagination.total ?? 0, isLoading };
}

/** Breakdown of all KYC submissions by status. */
export function KycDistribution() {
  const totals: Record<KYCStatus, ReturnType<typeof useKycTotal>> = {
    PENDING: useKycTotal("PENDING"),
    VERIFIED: useKycTotal("VERIFIED"),
    REJECTED: useKycTotal("REJECTED"),
  };
  const isLoading = Object.values(totals).some((t) => t.isLoading);
  const slices = STATUSES.map(({ status, label }) => ({ label, value: totals[status].total }));
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC status</CardTitle>
        <CardDescription>All submissions by review status</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : total === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No submissions yet
          </p>
        ) : (
          <DonutChart
            data={slices}
            colors={STATUSES.map((s) => s.color)}
            ariaLabel="KYC submissions by status"
          />
        )}
      </CardContent>
    </Card>
  );
}
