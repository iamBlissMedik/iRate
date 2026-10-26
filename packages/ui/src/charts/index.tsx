"use client";

import { useId } from "react";
import {
  Area,
  AreaChart as ReAreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@irate/ui/lib/utils";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

/** Short axis labels: 60000 → "60K". */
const compact = new Intl.NumberFormat("en", { notation: "compact" });

interface TooltipPayloadItem {
  name?: string | number;
  value?: string | number;
  color?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  formatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label !== undefined ? (
        <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      ) : null}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: item.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
          />
          <span className="text-popover-foreground tabular-nums">
            {formatter && typeof item.value === "number" ? formatter(item.value) : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface TrendChartProps {
  data: SeriesPoint[];
  className?: string;
  height?: number;
  colorIndex?: number;
  valueFormatter?: (n: number) => string;
  /** Accessible description of the chart for screen readers. */
  ariaLabel?: string;
}

/** Smooth gradient area chart — ideal for balance / volume over time. */
export function AreaTrendChart({
  data,
  className,
  height = 240,
  colorIndex = 0,
  valueFormatter,
  ariaLabel,
}: TrendChartProps) {
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];
  const gradientId = `area-${useId()}`;
  return (
    <div
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label={ariaLabel ?? "Trend area chart"}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} width={48} tickFormatter={(n: number) => compact.format(n)} />
          <Tooltip
            cursor={{ stroke: "var(--color-border)" }}
            content={<ChartTooltip formatter={valueFormatter} />}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={700}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
}

/** Donut chart with a legend — distributions such as KYC status or cashflow. */
export function DonutChart({
  data,
  className,
  height = 220,
  valueFormatter = (n) => n.toLocaleString(),
  colors = CHART_COLORS,
  ariaLabel,
}: {
  data: DonutSlice[];
  className?: string;
  height?: number;
  valueFormatter?: (n: number) => string;
  /** Override the default palette (e.g. semantic status colours). */
  colors?: string[];
  /** Accessible description of the chart for screen readers. */
  ariaLabel?: string;
}) {
  const colorAt = (i: number) => colors[i % colors.length];
  return (
    <div className={cn("w-full", className)}>
      <div style={{ height }} role="img" aria-label={ariaLabel ?? "Donut distribution chart"}>
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="var(--color-card)"
              strokeWidth={2}
              animationDuration={700}
            >
              {data.map((slice, i) => (
                <Cell key={slice.label} fill={colorAt(i)} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
          </RePieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        {data.map((slice, i) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: colorAt(i) }} />
            <span className="text-muted-foreground">{slice.label}</span>
            <span className="font-medium tabular-nums">{valueFormatter(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
