"use client";

import { useAdminOverview } from "@irate/api-client/react";
import { formatMajor, minorToMajorNumber } from "@irate/contracts/money";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@irate/ui";
import { DonutChart } from "@irate/ui/charts";

/** Money in vs money out across all transactions (from the overview's cashflow card). */
export function CashflowChart() {
  const { data, isLoading } = useAdminOverview();
  const slices = [
    { label: "Money in", value: minorToMajorNumber(data?.totalCashflow.credit ?? "0") },
    { label: "Money out", value: minorToMajorNumber(data?.totalCashflow.debit ?? "0") },
  ];
  const hasData = slices.some((s) => s.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
        <CardDescription>Credits vs debits across all transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : hasData ? (
          <DonutChart
            data={slices}
            valueFormatter={formatMajor}
            ariaLabel="Money in versus money out"
          />
        ) : (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No transactions yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
