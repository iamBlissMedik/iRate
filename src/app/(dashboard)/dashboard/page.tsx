"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TransactionVolumeChart from "@/components/dashboard/TransactionVolumeChart";
import NewUsersChart from "@/components/dashboard/NewUsersChart";
import ChartCard from "@/components/ui/CustomChartCard";
import { recentTransactions } from "@/constants/transactionDummyData";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary dark:text-white">Welcome back, User</h1>
        <h1 className="text-2xl font-semibold text-primary dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
          Overview of system performance and activities
        </p>
      </div>

      {/* Top Stat Cards */}
      <DashboardStats />

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Transaction Volume (Weekly)">
          <TransactionVolumeChart />
        </ChartCard>
        <ChartCard title="New Users (Weekly)">
          <NewUsersChart />
        </ChartCard>
      </div> */}

      {/* Recent Transactions */}
      {/* {recentTransactions.map((trx, index) => (
       <RecentTransactions {...trx} key={index} />
      ))} */}
     
    </div>
  );
}
