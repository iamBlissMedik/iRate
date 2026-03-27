"use client";

import { memo, useMemo } from "react";
import DashboardStatCard from "@/shared/components/ui/CustomDashboardStatCard";
import { useDashboardOverview } from "@/features/dashboard/hooks/overview.hooks";
import StatSkeleton from "@/shared/components/ui/CustomStatSkeleton";
import { adaptOverviewToDashboardStats } from "../adapters";

/**
 * DashboardStats Component (Optimized)
 *
 * Optimizations applied:
 * - memo: Prevents unnecessary re-renders when parent re-renders
 * - useMemo: Memoizes the stats transformation
 * - Skeleton array generation is outside component
 */

const SKELETON_ARRAY = Array.from({ length: 5 });

const DashboardStats = () => {
  const { data, isLoading, isError } = useDashboardOverview();

  // Memoize the stats transformation to avoid recalculation on every render
  const stats = useMemo(() => {
    return data ? adaptOverviewToDashboardStats(data) : [];
  }, [data]);

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {SKELETON_ARRAY.map((_, i) => (
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

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {stats.map((item) => (
        <DashboardStatCard key={item.id} {...item} />
      ))}
    </section>
  );
};

// memo prevents re-renders when parent re-renders but props haven't changed
export default memo(DashboardStats);
