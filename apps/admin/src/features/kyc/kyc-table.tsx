"use client";

import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { format } from "date-fns";
import type { KYCReviewInput, KYCStatus } from "@irate/contracts";
import { useAdminKyc, useReviewKyc } from "@irate/api-client/react";
import { getErrorMessage } from "@irate/api-client";
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  KycStatusBadge,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  toast,
} from "@irate/ui";
import { TablePagination } from "@/components/table-pagination";

type Filter = KYCStatus | "ALL";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

const PAGE_SIZE = 10;

/** KYC submissions filtered by status, with approve/reject for pending ones. */
export function KycTable() {
  const [filter, setFilter] = useState<Filter>("PENDING");
  const [page, setPage] = useState(1);
  const review = useReviewKyc();
  const { data, isLoading, isFetching } = useAdminKyc({
    page,
    limit: PAGE_SIZE,
    ...(filter !== "ALL" && { status: filter }),
  });
  const rows = data?.kycs ?? [];

  const onReview = (kycId: string, action: KYCReviewInput["action"]) =>
    review.mutate(
      { kycId, input: { action } },
      {
        onSuccess: () => toast.success(action === "APPROVE" ? "KYC approved" : "KYC rejected"),
        onError: (error) => toast.error(getErrorMessage(error, "Review failed")),
      },
    );

  return (
    <Card>
      <CardContent className="space-y-4">
        <Tabs
          value={filter}
          onValueChange={(value) => {
            setFilter(value as Filter);
            setPage(1);
          }}
        >
          <TabsList>
            {FILTERS.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Nothing to review"
            description="There are no submissions with this status."
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
              {rows.map((kyc) => {
                // Only the row being reviewed shows a spinner.
                const reviewing = review.isPending && review.variables?.kycId === kyc.id;
                return (
                  <TableRow key={kyc.id}>
                    <TableCell className="font-medium">{kyc.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {kyc.user?.email ?? "—"}
                    </TableCell>
                    <TableCell>{kyc.idType}</TableCell>
                    <TableCell>
                      <KycStatusBadge status={kyc.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {kyc.createdAt ? format(new Date(kyc.createdAt), "d MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {kyc.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={review.isPending}
                            loading={reviewing && review.variables?.input.action === "APPROVE"}
                            onClick={() => onReview(kyc.id, "APPROVE")}
                          >
                            <Check /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={review.isPending}
                            loading={reviewing && review.variables?.input.action === "REJECT"}
                            onClick={() => onReview(kyc.id, "REJECT")}
                          >
                            <X /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Reviewed</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <TablePagination
          pagination={data?.pagination}
          onPageChange={setPage}
          disabled={isFetching}
        />
      </CardContent>
    </Card>
  );
}
