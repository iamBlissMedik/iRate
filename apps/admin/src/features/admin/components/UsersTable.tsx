"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Wallet } from "lucide-react";
import { useAdminUsers } from "@irate/api-client/react";
import { formatMoney } from "@irate/contracts/money";
import { format } from "date-fns";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@irate/ui";
import { KycStatusBadge } from "./KycStatusBadge";
import { CreditWalletDialog } from "./CreditWalletDialog";

const LIMIT = 10;

export function UsersTable() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search input → server-side query; reset to page 1 on change.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching } = useAdminUsers({
    page,
    limit: LIMIT,
    ...(search ? { search } : {}),
  });

  const users = data?.users ?? [];
  const meta = data?.pagination;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email or name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          {meta ? (
            <p className="text-sm text-muted-foreground">{meta.total} users</p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load users.</p>
        ) : users.length === 0 ? (
          <EmptyState icon={Search} title="No users found" description="Try a different search." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const wallet = u.wallets?.[0];
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <KycStatusBadge status={u.kyc?.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {wallet ? formatMoney(wallet.balance) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.createdAt ? format(new Date(u.createdAt), "d MMM yyyy") : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {wallet ? (
                          <CreditWalletDialog
                            walletId={wallet.id}
                            subjectLabel={u.email}
                            trigger={
                              <Button size="sm" variant="outline">
                                <Wallet className="size-4" /> Credit
                              </Button>
                            }
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">No wallet</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Server-side pagination */}
            {meta && (meta.totalPages ?? 1) > 1 ? (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!meta.hasPrevPage || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-4" /> Prev
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!meta.hasNextPage || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
