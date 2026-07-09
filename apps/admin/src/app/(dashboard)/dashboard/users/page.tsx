import type { Metadata } from "next";
import { UsersTable } from "@/features/admin/components/UsersTable";

export const metadata: Metadata = { title: "Users · iRate Admin" };

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customers, review KYC status, and credit wallets.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
