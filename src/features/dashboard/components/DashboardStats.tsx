"use client";
import { stats } from "@/constants/dummyData";
import DashboardStatCard from "@/shared/components/ui/CustomDashboardStatCard";

export default function DashboardStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {stats.map((item) => (
        <DashboardStatCard
          key={item.id}
          title={item.title}
          value={item.value}
          trend={item.trend}
          trendType={item.trendType}
          icon={item.icon}
          iconColor={item.iconColor}
        />
      ))}
    </section>
  );
}
