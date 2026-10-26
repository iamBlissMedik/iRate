import type { Metadata } from "next";
import { PageHeader } from "@irate/ui";
import { KycDistribution } from "@/features/kyc/kyc-distribution";
import { KycTable } from "@/features/kyc/kyc-table";

export const metadata: Metadata = { title: "KYC review" };

export default function KycPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC review"
        description="Approve or reject identity verification submissions."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <KycTable />
        <KycDistribution />
      </div>
    </div>
  );
}
