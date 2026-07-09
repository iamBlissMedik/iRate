"use client";

import { DashboardStats, CashflowChart } from "@/features/dashboard";
import { FadeIn } from "@irate/ui/motion";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <FadeIn>
        <div className="mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of system performance and activity
          </p>
        </div>
      </FadeIn>

      {/* Top stat cards (staggered) */}
      <DashboardStats />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CashflowChart />
      </div>
    </div>
  );
}
