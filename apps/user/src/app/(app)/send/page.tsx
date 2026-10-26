import type { Metadata } from "next";
import { PageHeader } from "@irate/ui";
import { SendMoneyForm } from "@/features/transactions/send-money-form";

export const metadata: Metadata = { title: "Send money" };

export default function SendPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Send money" description="Pay anyone with an iRate account number." />
      <SendMoneyForm />
    </div>
  );
}
