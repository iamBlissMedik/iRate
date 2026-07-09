"use client";

import Link from "next/link";
import { ArrowLeftRight, Copy, Plus, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import {
  BalanceAmount,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
  StatCard,
  cn,
  toast,
} from "@irate/ui";
import { AreaTrendChart } from "@irate/ui/charts";
import { Stagger } from "@irate/ui/motion";
import { useUserOverview } from "@irate/api-client/react";
import { formatMoney, maskAccountNumber, minorToMajorNumber } from "@irate/contracts/money";
import { TransactionRow } from "@/features/transactions/transaction-row";

export default function DashboardPage() {
  const { data, isLoading } = useUserOverview();

  const activity = data?.recentTransactions ?? [];
  const series = [...activity]
    .reverse()
    .filter((t) => t.balanceAfter)
    .map((t, i) => ({
      label: `#${i + 1}`,
      value: minorToMajorNumber(t.balanceAfter!),
    }));

  const copyAccount = () => {
    if (data?.accountNumber) {
      navigator.clipboard.writeText(data.accountNumber);
      toast.success("Account number copied");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Available balance</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-10 w-48" />
          ) : (
            <BalanceAmount value={data?.balance ?? "0"} currency={data?.currency} />
          )}
        </div>
      </div>

      {/* Account number + quick actions */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Account number
            </p>
            {isLoading ? (
              <Skeleton className="mt-1 h-6 w-32" />
            ) : (
              <button
                onClick={copyAccount}
                className="mt-1 flex items-center gap-2 text-lg font-semibold tabular-nums hover:text-primary"
              >
                {data?.accountNumber ? maskAccountNumber(data.accountNumber) : "—"}
                <Copy className="size-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/send">
                <ArrowLeftRight className="size-4" /> Send
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/transactions">
                <Receipt className="size-4" /> Activity
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Money in"
          value={formatMoney(data?.stats?.totalIn ?? "0")}
          numericValue={minorToMajorNumber(data?.stats?.totalIn ?? "0")}
          format={(n) => formatMoney(Math.round(n * 100))}
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Money out"
          value={formatMoney(data?.stats?.totalOut ?? "0")}
          numericValue={minorToMajorNumber(data?.stats?.totalOut ?? "0")}
          format={(n) => formatMoney(Math.round(n * 100))}
          icon={TrendingDown}
          loading={isLoading}
        />
        <StatCard
          label="Transactions"
          value={String(data?.stats?.transactionCount ?? activity.length)}
          numericValue={data?.stats?.transactionCount ?? activity.length}
          icon={Receipt}
          loading={isLoading}
        />
      </div>

      {/* Trend */}
      {series.length > 1 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Balance trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaTrendChart
              data={series}
              valueFormatter={(n) => formatMoney(Math.round(n * 100))}
            />
          </CardContent>
        </Card>
      ) : null}

      {/* Recent activity */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Recent activity</CardTitle>
          <Link href="/transactions" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="No transactions yet"
              description="Send or receive money to see your activity here."
              action={
                <Button asChild>
                  <Link href="/send">Send money</Link>
                </Button>
              }
            />
          ) : (
            <Stagger className={cn("divide-y divide-border")}>
              {activity.slice(0, 6).map((tx) => (
                <Stagger.Item key={tx.id}>
                  <TransactionRow tx={tx} />
                </Stagger.Item>
              ))}
            </Stagger>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
