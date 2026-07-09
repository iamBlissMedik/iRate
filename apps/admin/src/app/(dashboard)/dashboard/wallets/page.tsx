import type { Metadata } from "next";
import { WalletsOverview } from "@/features/admin/components/WalletsOverview";

export const metadata: Metadata = { title: "Wallets · iRate Admin" };

export default function WalletsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Wallets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform balance and manual wallet credits.
        </p>
      </div>
      <WalletsOverview />
    </div>
  );
}
