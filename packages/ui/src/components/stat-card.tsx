"use client";

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@irate/ui/lib/utils";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@irate/ui/components/ui/card";
import { Skeleton } from "@irate/ui/components/ui/skeleton";
import { AnimatedNumber } from "@irate/ui/motion";

export interface StatCardProps {
  label: string;
  /**
   * A number counts up from 0 and is displayed through `format`; a string is
   * shown as-is (use it for placeholders like "—").
   */
  value: number | string;
  format?: (n: number) => string;
  icon?: LucideIcon;
  /** Percentage change vs the previous period, e.g. 12.4 or -3. */
  delta?: number;
  hint?: string;
  loading?: boolean;
  className?: string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString();

/** Headline metric tile used on both dashboards. */
export function StatCard({
  label,
  value,
  format = defaultFormat,
  icon: Icon,
  delta,
  hint,
  loading,
  className,
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  const showFooter = !loading && (delta !== undefined || hint);

  return (
    <Card className={cn("h-full gap-3", className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : typeof value === "number" ? (
            <AnimatedNumber value={value} format={format} />
          ) : (
            value
          )}
        </CardTitle>
        {Icon ? (
          <CardAction>
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
          </CardAction>
        ) : null}
      </CardHeader>
      {showFooter ? (
        <CardFooter className="gap-1.5 text-xs">
          {delta !== undefined ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                positive ? "text-success" : "text-destructive",
              )}
            >
              {positive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
