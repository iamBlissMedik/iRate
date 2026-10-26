"use client";

import type { ReactNode } from "react";
import { Receipt } from "lucide-react";
import type { TransactionEntry } from "@irate/contracts";
import { EmptyState, Skeleton } from "@irate/ui";
import { Stagger } from "@irate/ui/motion";
import { TransactionRow } from "./transaction-row";

/** A statement list with loading and empty states. */
export function TransactionList({
  transactions,
  loading,
  skeletonRows = 5,
  emptyAction,
}: {
  transactions: TransactionEntry[];
  loading?: boolean;
  skeletonRows?: number;
  emptyAction?: ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonRows }, (_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Money you send and receive will show up here."
        action={emptyAction}
      />
    );
  }

  return (
    <Stagger className="divide-y">
      {transactions.map((tx) => (
        <Stagger.Item key={tx.id}>
          <TransactionRow tx={tx} />
        </Stagger.Item>
      ))}
    </Stagger>
  );
}
