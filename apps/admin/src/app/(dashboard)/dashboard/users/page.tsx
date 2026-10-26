import type { Metadata } from "next";
import { PageHeader } from "@irate/ui";
import { UsersTable } from "@/features/users/users-table";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Customers, their KYC status and wallet balances." />
      <UsersTable />
    </div>
  );
}
