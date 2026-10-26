"use client";

import { useTransactions } from "@irate/api-client/react";
import { Card, CardContent, PageHeader } from "@irate/ui";
import { TransactionList } from "@/features/transactions/transaction-list";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();

  return (
    <div className="space-y-6">
      <PageHeader title="Activity" description="Every transfer in and out of your wallet." />
      <Card>
        <CardContent>
          <TransactionList transactions={data ?? []} loading={isLoading} skeletonRows={8} />
        </CardContent>
      </Card>
    </div>
  );
}
