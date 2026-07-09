"use client";

import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { format } from "date-fns";
import type { KYCStatus } from "@irate/contracts";
import { useAdminKyc, useReviewKyc } from "@irate/api-client/react";
import { getErrorMessage } from "@irate/api-client";
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  toast,
} from "@irate/ui";
import { KycStatusBadge } from "./KycStatusBadge";

const FILTERS: { label: string; value: KYCStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

export function KycTable() {
  const [filter, setFilter] = useState<KYCStatus | "ALL">("PENDING");
  const review = useReviewKyc();

  const { data, isLoading, isError } = useAdminKyc({
    page: 1,
    limit: 50,
    ...(filter !== "ALL" ? { status: filter } : {}),
  });

  const rows = data?.kycs ?? [];

  const onReview = async (kycId: string, action: "APPROVE" | "REJECT") => {
    try {
      await review.mutateAsync({ kycId, input: { action } });
      toast.success(`KYC ${action === "APPROVE" ? "approved" : "rejected"}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        {/* Status filter */}
        <div className="mb-4 flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load KYC submissions.</p>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Nothing to review"
            description="There are no KYC submissions for this filter."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {k.user?.email ?? "—"}
                  </TableCell>
                  <TableCell>{k.idType}</TableCell>
                  <TableCell>
                    <KycStatusBadge status={k.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {k.createdAt ? format(new Date(k.createdAt), "d MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {k.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          loading={review.isPending}
                          onClick={() => onReview(k.id, "APPROVE")}
                        >
                          <Check className="size-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          loading={review.isPending}
                          onClick={() => onReview(k.id, "REJECT")}
                        >
                          <X className="size-4" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Reviewed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
