"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import type { TransactionEntry } from "@irate/contracts";
import { Money, cn } from "@irate/ui";

export function TransactionRow({ tx }: { tx: TransactionEntry }) {
  const incoming = tx.direction === "in";
  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          incoming ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
        )}
      >
        {incoming ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {tx.counterparty?.name ?? tx.description}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {tx.counterparty?.accountNumber
            ? `${tx.counterparty.accountNumber} · `
            : ""}
          {format(new Date(tx.createdAt), "d MMM, HH:mm")}
        </p>
      </div>
      <div className="text-right">
        <Money
          value={incoming ? tx.amount : `-${tx.amount}`}
          colorize
          signed
          className="text-sm font-semibold"
        />
        {tx.balanceAfter ? (
          <p className="text-xs text-muted-foreground">
            <Money value={tx.balanceAfter} />
          </p>
        ) : null}
      </div>
    </div>
  );
}
