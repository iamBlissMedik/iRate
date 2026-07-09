"use client";

import { useAdminOverview } from "@irate/api-client/react";
import { formatMoney, minorToMajorNumber } from "@irate/contracts/money";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@irate/ui";
import { DonutChart, CHART_COLORS } from "@irate/ui/charts";
import { FadeIn } from "@irate/ui/motion";

/** Credit vs debit composition from the dashboard overview's totalCashflow. */
export function CashflowChart() {
  const { data, isLoading } = useAdminOverview();
  const cashflow = data?.totalCashflow;

  const credit = cashflow?.credit ?? "0";
  const debit = cashflow?.debit ?? "0";
  const slices = [
    { label: "Credit (in)", value: minorToMajorNumber(credit) },
    { label: "Debit (out)", value: minorToMajorNumber(debit) },
  ];
  const hasData = slices.some((s) => s.value > 0);

  return (
    <FadeIn delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cashflow</CardTitle>
          <CardDescription>Credit vs debit across all transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[240px] w-full" />
          ) : hasData ? (
            <>
              <DonutChart
                data={slices}
                valueFormatter={(n) => formatMoney(Math.round(n * 100))}
              />
              <div className="mt-4 flex justify-center gap-6 text-sm">
                {slices.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium tabular-nums">
                      {formatMoney(i === 0 ? credit : debit)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
              No transaction data yet
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
