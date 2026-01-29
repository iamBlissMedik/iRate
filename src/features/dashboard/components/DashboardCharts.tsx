"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardCharts } from "../hooks/charts.hooks";
import { formatNairaCompact } from "@/shared/utils/currency.utils";

export default function DashboardCharts() {
  const { data, isLoading } = useDashboardCharts();

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-muted rounded-xl" />;
  }

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">
        Cashflow & Volume
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatNairaCompact} />
          <Tooltip formatter={(v) => formatNairaCompact(Number(v))} />
          <Line type="monotone" dataKey="cashflow" strokeWidth={2} />
          <Line type="monotone" dataKey="volume" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
