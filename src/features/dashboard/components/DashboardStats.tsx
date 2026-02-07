"use client";

import DashboardStatCard from "@/shared/components/ui/CustomDashboardStatCard";
import { useDashboardOverview } from "@/features/dashboard/hooks/overview.hooks";
import StatSkeleton from "@/shared/components/ui/CustomStatSkeleton";
import { adaptOverviewToDashboardStats } from "../services/dashboardStats.adapter";

export default function DashboardStats() {
  const { data, isLoading, isError } = useDashboardOverview();

  if (isLoading) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <StatSkeleton key={i} />
      ))}
    </section>
  );
}

  if (isError || !data) {
    return (
      <p className="text-sm text-red-500">
        Failed to load dashboard statistics
      </p>
    );
  }

  const stats = adaptOverviewToDashboardStats(data);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {stats.map((item) => (
        <DashboardStatCard key={item.id} {...item} />
      ))}
    </section>
  );
}
