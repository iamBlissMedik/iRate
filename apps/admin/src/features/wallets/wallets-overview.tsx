"use client";

import { useState } from "react";
import { Layers, Wallet } from "lucide-react";
import { useAdminTotalBalance } from "@irate/api-client/react";
import { formatMajor, minorToMajorNumber } from "@irate/contracts/money";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  StatCard,
} from "@irate/ui";
import { CreditWalletDialog } from "./credit-wallet-dialog";

/** Platform-wide balance plus a manual credit by wallet ID. */
export function WalletsOverview() {
  const { data, isLoading } = useAdminTotalBalance();
  const [walletId, setWalletId] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total wallet balance"
          value={data ? minorToMajorNumber(data.value) : "—"}
          format={(n) => formatMajor(n, { currency: data?.currency })}
          icon={Wallet}
          delta={data?.trend}
          loading={isLoading}
        />
        <StatCard label="Wallets" value={data?.wallets ?? "—"} icon={Layers} loading={isLoading} />
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Credit a wallet</CardTitle>
          <CardDescription>
            To credit a specific customer, use the Credit action on the Users page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="walletId">Wallet ID</FieldLabel>
            <Input
              id="walletId"
              placeholder="Paste a wallet ID"
              autoComplete="off"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value.trim())}
            />
            <FieldDescription>The internal wallet ID, not the 10-digit account number.</FieldDescription>
          </Field>
          <CreditWalletDialog
            walletId={walletId}
            trigger={
              <Button disabled={!walletId}>
                <Wallet /> Credit wallet
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
