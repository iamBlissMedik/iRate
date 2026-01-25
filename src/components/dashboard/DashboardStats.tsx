"use client";

import { Wallet, Users, Banknote, Activity, BarChart3 } from "lucide-react";
import { useDashboardOverview } from "@/services/dashboard/hooks/overview.hooks";
import DashboardStatCard, { DashboardStatCardProps } from "../ui/CustomDashboardStatCard";

export default function DashboardStats() {
  const { data, isLoading } = useDashboardOverview();
  
  const query = useDashboardOverview();
  console.log("dashboard query", query);

  if (isLoading) {
    return <div>Loading dashboard stats...</div>;
  }

  if (!data) return null;

const stats: (DashboardStatCardProps & { id: number })[] = [
  {
    id: 1,
    title: "Total Wallet Balance",
    value: `₦${data.totalWalletBalance.toLocaleString()}`,
    icon: Wallet,
    trend: "+2.4%",
    trendType: "up",
    iconColor:
      "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    id: 2,
    title: "Total Users",
    value: data.totalUsers.toLocaleString(),
    icon: Users,
    trend: "+380 today",
    trendType: "up",
    iconColor:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300",
  },
  {
    id: 3,
    title: "Total Transactions",
    value: data.totalTransactions.toLocaleString(),
    icon: Banknote,
    trend: "+3.8%",
    trendType: "up",
    iconColor:
      "text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-300",
  },
  {
    id: 4,
    title: "Total Cashflow",
    value: `₦${data.totalCashflow.toLocaleString()}`,
    icon: Activity,
    trend: "-1.2%",
    trendType: "down",
    iconColor:
      "text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300",
  },
  {
    id: 5,
    title: "Transaction Volumes",
    value: `₦${data.transactionVolume.toLocaleString()}`,
    icon: BarChart3,
    trend: "+3.2%",
    trendType: "up",
    iconColor:
      "text-teal-600 bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300",
  },
];


  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {stats.map((item) => (
        <DashboardStatCard key={item.id} {...item} />
      ))}
    </section>
  );
}
