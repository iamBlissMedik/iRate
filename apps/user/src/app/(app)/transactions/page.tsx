"use client";

import { Receipt } from "lucide-react";
import { Card, CardContent, EmptyState, Skeleton } from "@irate/ui";
import { Stagger } from "@irate/ui/motion";
import { useTransactions } from "@irate/api-client/react";
import { TransactionRow } from "@/features/transactions/transaction-row";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();
  const txns = data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Activity</h1>
      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : txns.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Your transfers and received payments will appear here."
            />
          ) : (
            <Stagger className="divide-y divide-border">
              {txns.map((tx) => (
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
