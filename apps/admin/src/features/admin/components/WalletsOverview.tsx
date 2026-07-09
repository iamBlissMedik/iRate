"use client";

import { useState } from "react";
import { Wallet, Layers } from "lucide-react";
import { useAdminTotalBalance } from "@irate/api-client/react";
import { formatMoney } from "@irate/contracts/money";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  StatCard,
} from "@irate/ui";
import { CreditWalletDialog } from "./CreditWalletDialog";

export function WalletsOverview() {
  const { data, isLoading } = useAdminTotalBalance();
  const [walletId, setWalletId] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Total wallet balance"
          value={data ? formatMoney(data.value, { currency: data.currency }) : "—"}
          icon={Wallet}
          delta={data?.trend}
          loading={isLoading}
        />
        <StatCard
          label="Wallets"
          value={data?.wallets != null ? String(data.wallets) : "—"}
          icon={Layers}
          loading={isLoading}
        />
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Credit a wallet</CardTitle>
          <CardDescription>
            Enter the wallet ID (found on a user&apos;s row) to add funds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletId">Wallet ID</Label>
            <Input
              id="walletId"
              placeholder="cmqki2q63..."
              value={walletId}
              onChange={(e) => setWalletId(e.target.value.trim())}
            />
          </div>
          <CreditWalletDialog
            walletId={walletId}
            trigger={
              <Button disabled={!walletId}>
                <Wallet className="size-4" /> Credit wallet
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
