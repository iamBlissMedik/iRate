"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatMoney, type MinorUnits } from "@irate/contracts/money";
import { cn } from "@irate/ui/lib/utils";
import { Button } from "@irate/ui/components/ui/button";

export interface MoneyProps {
  /** Amount in minor units (string from the API, or number/bigint). */
  value: MinorUnits;
  currency?: string;
  className?: string;
  /** Colour negative amounts red and positive amounts green. */
  colorize?: boolean;
  /** Prefix positive amounts with "+". */
  signed?: boolean;
}

/** Renders an exact money amount with tabular figures. */
export function Money({ value, currency = "NGN", className, colorize, signed }: MoneyProps) {
  const negative = String(value).startsWith("-");
  const formatted = formatMoney(value, { currency });
  return (
    <span
      className={cn(
        "tabular-nums",
        colorize && (negative ? "text-destructive" : "text-success"),
        className,
      )}
    >
      {signed && !negative ? `+${formatted}` : formatted}
    </span>
  );
}

/** A large balance figure with a privacy (show/hide) toggle. */
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
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
        {hidden ? "••••••" : formatMoney(value, { currency })}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setHidden((h) => !h)}
        aria-label={hidden ? "Show balance" : "Hide balance"}
        className="text-muted-foreground"
      >
        {hidden ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
