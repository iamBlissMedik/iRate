import type { Metadata } from "next";
import { SendMoneyForm } from "@/features/transactions/send-money-form";

export const metadata: Metadata = { title: "Send money" };

export default function SendPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Send money</h1>
      <SendMoneyForm />
    </div>
  );
}
