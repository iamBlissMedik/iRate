"use client";

import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "../primitives/card";
import { Skeleton } from "../primitives/skeleton";
import { AnimatedNumber } from "../motion/animated-number";
import { cn } from "../lib/cn";

export interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  /** Percentage change vs previous period, e.g. +12.4. */
  delta?: number;
  hint?: string;
  loading?: boolean;
  className?: string;
  /**
   * Provide a raw number to animate the figure counting up on mount. `format`
   * turns the interpolated number into the display string (e.g. currency).
   * Falls back to the static `value` when omitted.
   */
  numericValue?: number;
  format?: (n: number) => string;
}

/** Headline metric tile used across dashboards, with an animated mount. */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  loading,
  className,
  numericValue,
  format,
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {Icon ? (
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            ) : null}
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-8 w-32" />
          ) : (
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
              {numericValue !== undefined ? (
                <AnimatedNumber
                  value={numericValue}
                  format={format ?? ((n) => Math.round(n).toLocaleString())}
                />
              ) : (
                value
              )}
            </p>
          )}
          {(delta !== undefined || hint) && !loading ? (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
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
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
