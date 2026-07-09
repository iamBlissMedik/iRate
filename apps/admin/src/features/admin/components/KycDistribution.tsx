"use client";

import { useMemo } from "react";
import type { KYCStatus } from "@irate/contracts";
import { useAdminKyc } from "@irate/api-client/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@irate/ui";
import { DonutChart } from "@irate/ui/charts";
import { FadeIn } from "@irate/ui/motion";

const ORDER: KYCStatus[] = ["PENDING", "VERIFIED", "REJECTED"];
const COLORS = [
  "var(--color-warning)",
  "var(--color-success)",
  "var(--color-destructive)",
];

/** Status breakdown of KYC submissions (derived from the loaded set). */
export function KycDistribution() {
  // Unfiltered so the breakdown reflects all statuses, not the table filter.
  const { data, isLoading } = useAdminKyc({ page: 1, limit: 100 });

  const counts = useMemo(() => {
    const c: Record<KYCStatus, number> = { PENDING: 0, VERIFIED: 0, REJECTED: 0 };
    for (const k of data?.kycs ?? []) c[k.status] = (c[k.status] ?? 0) + 1;
    return c;
  }, [data]);

  const slices = ORDER.map((s) => ({ label: s, value: counts[s] }));
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">KYC status</CardTitle>
          <CardDescription>Breakdown of submissions by status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[220px] w-full" />
          ) : total === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No submissions yet
            </div>
          ) : (
            <>
              <DonutChart data={slices} height={220} colors={COLORS} valueFormatter={(n) => `${n}`} />
              <div className="mt-4 flex justify-center gap-5 text-sm">
                {slices.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
