import { PageHeader } from "@irate/ui";
import { CashflowChart } from "@/features/dashboard/cashflow-chart";
import { DashboardStats } from "@/features/dashboard/dashboard-stats";
import { KycDistribution } from "@/features/kyc/kyc-distribution";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Platform health and activity at a glance." />
      <DashboardStats />
      <div className="grid gap-6 lg:grid-cols-2">
        <CashflowChart />
        <KycDistribution />
      </div>
    </div>
  );
}
