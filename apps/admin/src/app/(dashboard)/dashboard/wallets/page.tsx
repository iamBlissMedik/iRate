import type { Metadata } from "next";
import { PageHeader } from "@irate/ui";
import { WalletsOverview } from "@/features/wallets/wallets-overview";

export const metadata: Metadata = { title: "Wallets" };

export default function WalletsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Wallets" description="Platform balance and manual wallet credits." />
      <WalletsOverview />
    </div>
  );
}
