"use client";

import { DashboardStats } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary dark:text-white">
          Welcome back, User
        </h1>
        <h1 className="text-2xl font-semibold text-primary dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
          Overview of system performance and activities
        </p>
      </div>

      {/* Top Stat Cards */}
      <DashboardStats />
    </div>
  );
}
