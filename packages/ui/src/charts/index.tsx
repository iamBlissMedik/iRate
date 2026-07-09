"use client";

import {
  Area,
  AreaChart as ReAreaChart,
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../lib/cn";

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
          <span className="tabular-nums text-popover-foreground">
            {formatter && typeof item.value === "number"
              ? formatter(item.value)
              : item.value}
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
  const gradientId = `area-grad-${colorIndex}`;
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
          <YAxis {...axisProps} width={48} />
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

/** Bar chart — daily counts, user signups, etc. */
export function BarTrendChart({
  data,
  className,
  height = 240,
  colorIndex = 1,
  valueFormatter,
  ariaLabel,
}: TrendChartProps) {
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];
  return (
    <div
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label={ariaLabel ?? "Bar chart"}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} width={48} />
          <Tooltip
            cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
            content={<ChartTooltip formatter={valueFormatter} />}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} animationDuration={700} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
}

/** Donut chart — distribution (e.g. KYC status breakdown). */
export function DonutChart({
  data,
  className,
  height = 240,
  valueFormatter,
  colors,
  ariaLabel,
}: {
  data: DonutSlice[];
  className?: string;
  height?: number;
  valueFormatter?: (n: number) => string;
  /** Override the default palette (e.g. semantic status colors). */
  colors?: string[];
  /** Accessible description of the chart for screen readers. */
  ariaLabel?: string;
}) {
  const palette = colors ?? CHART_COLORS;
  return (
    <div
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label={ariaLabel ?? "Donut distribution chart"}
    >
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
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

export { CHART_COLORS };
