import type { KYCStatus } from "@irate/contracts";
import { Badge } from "@irate/ui/components/ui/badge";

const STATUS: Record<KYCStatus, { label: string; variant: "warning" | "success" | "destructive" }> =
  {
    PENDING: { label: "Pending", variant: "warning" },
    VERIFIED: { label: "Verified", variant: "success" },
    REJECTED: { label: "Rejected", variant: "destructive" },
  };

/** Colour-coded KYC status; `null`/`undefined` means nothing was submitted. */
export function KycStatusBadge({ status }: { status?: KYCStatus | null }) {
  if (!status) return <Badge variant="outline">Not submitted</Badge>;
  const { label, variant } = STATUS[status];
  return <Badge variant={variant}>{label}</Badge>;
}
