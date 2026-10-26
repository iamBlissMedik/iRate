"use client";

import Link from "next/link";
import { ArrowLeftRight, Copy, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { useUserOverview } from "@irate/api-client/react";
import { formatMajor, maskAccountNumber, minorToMajorNumber } from "@irate/contracts/money";
import {
  BalanceAmount,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  StatCard,
  toast,
} from "@irate/ui";
import { AreaTrendChart } from "@irate/ui/charts";
import { Stagger } from "@irate/ui/motion";
import { TransactionList } from "@/features/transactions/transaction-list";

export default function DashboardPage() {
  const { data, isLoading } = useUserOverview();
  const activity = data?.recentTransactions ?? [];

  // Running balance after each recent transaction, oldest first.
  const balanceTrend = activity
    .filter((t) => t.balanceAfter)
    .reverse()
    .map((t, i) => ({ label: `#${i + 1}`, value: minorToMajorNumber(t.balanceAfter!) }));

  const copyAccountNumber = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.accountNumber).then(
      () => toast.success("Account number copied"),
      () => toast.error("Couldn't copy — select the number manually"),
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardDescription>Available balance</CardDescription>
          {isLoading || !data ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <BalanceAmount value={data.balance} currency={data.currency} />
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Account number</p>
            {isLoading || !data ? (
              <Skeleton className="mt-1 h-6 w-32" />
            ) : (
              <Button
                variant="ghost"
                className="-ml-3 text-lg font-semibold tabular-nums"
                onClick={copyAccountNumber}
                aria-label="Copy account number"
              >
                {maskAccountNumber(data.accountNumber)}
                <Copy className="text-muted-foreground" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/send">
                <ArrowLeftRight /> Send
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/transactions">
                <Receipt /> Activity
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Stagger className="grid gap-4 sm:grid-cols-3">
        <Stagger.Item>
          <StatCard
            label="Money in"
            value={minorToMajorNumber(data?.stats?.totalIn ?? "0")}
            format={formatMajor}
            icon={TrendingUp}
            loading={isLoading}
          />
        </Stagger.Item>
        <Stagger.Item>
          <StatCard
            label="Money out"
            value={minorToMajorNumber(data?.stats?.totalOut ?? "0")}
            format={formatMajor}
            icon={TrendingDown}
            loading={isLoading}
          />
        </Stagger.Item>
        <Stagger.Item>
          <StatCard
            label="Transactions"
            value={data?.stats?.transactionCount ?? activity.length}
            icon={Receipt}
            loading={isLoading}
          />
        </Stagger.Item>
      </Stagger>

      {balanceTrend.length > 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Balance trend</CardTitle>
            <CardDescription>Your balance after each recent transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrendChart
              data={balanceTrend}
              valueFormatter={formatMajor}
              ariaLabel="Balance after each recent transaction"
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardAction>
            <Button variant="link" size="sm" asChild>
              <Link href="/transactions">View all</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={activity.slice(0, 6)}
            loading={isLoading}
            skeletonRows={4}
            emptyAction={
              <Button asChild>
                <Link href="/send">Send money</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
