"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatMoney, type MinorUnits } from "@irate/contracts/money";
import { cn } from "../lib/cn";

export interface MoneyProps {
  /** Amount in minor units (string from the API, or number/bigint). */
  value: MinorUnits;
  currency?: string;
  className?: string;
  /** Color debits red / credits green based on sign or an explicit direction. */
  colorize?: boolean;
  signed?: boolean;
}

/** Renders an exact money amount with tabular figures. */
export function Money({ value, currency = "NGN", className, colorize, signed }: MoneyProps) {
  const negative = String(value).startsWith("-");
  const formatted = formatMoney(value, { currency });
  const display = signed && !negative ? `+${formatted}` : formatted;
  return (
    <span
      className={cn(
        "tabular-nums",
        colorize && (negative ? "text-destructive" : "text-success"),
        className,
      )}
    >
      {display}
    </span>
  );
}

/** A large balance figure with a privacy (show/hide) toggle, for the home card. */
export function BalanceAmount({
  value,
  currency = "NGN",
  className,
}: {
  value: MinorUnits;
  currency?: string;
  className?: string;
}) {
  const [hidden, setHidden] = useState(false);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
        {hidden ? "••••••" : formatMoney(value, { currency })}
      </span>
      <button
        type="button"
        onClick={() => setHidden((h) => !h)}
        aria-label={hidden ? "Show balance" : "Hide balance"}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {hidden ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}
