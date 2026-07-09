import type { KYCStatus } from "@irate/contracts";
import { Badge } from "@irate/ui";

const VARIANT: Record<KYCStatus, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  VERIFIED: "success",
  REJECTED: "destructive",
};

export function KycStatusBadge({ status }: { status?: KYCStatus | null }) {
  if (!status) return <Badge variant="outline">No KYC</Badge>;
  return <Badge variant={VARIANT[status]}>{status}</Badge>;
}
