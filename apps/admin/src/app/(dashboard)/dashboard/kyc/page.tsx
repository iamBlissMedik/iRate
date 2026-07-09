import type { Metadata } from "next";
import { KycTable } from "@/features/admin/components/KycTable";
import { KycDistribution } from "@/features/admin/components/KycDistribution";

export const metadata: Metadata = { title: "KYC · iRate Admin" };

export default function KycPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">KYC review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve or reject identity verification submissions.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <KycTable />
        <KycDistribution />
      </div>
    </div>
  );
}
