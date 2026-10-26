"use client";

import { useEffect, useState } from "react";
import { Search, Wallet } from "lucide-react";
import { format } from "date-fns";
import { useAdminUsers } from "@irate/api-client/react";
import { formatMoney } from "@irate/contracts/money";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  Input,
  KycStatusBadge,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@irate/ui";
import { TablePagination } from "@/components/table-pagination";
import { CreditWalletDialog } from "@/features/wallets/credit-wallet-dialog";

const PAGE_SIZE = 10;

/** Server-paginated, searchable customer list with a per-user wallet credit. */
export function UsersTable() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce typing into the server-side search; a new search starts at page 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    ...(search && { search }),
  });
  const users = data?.users ?? [];

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          {data ? (
            <p className="text-sm text-muted-foreground">{data.pagination.total} users</p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={Search} title="No users found" description="Try a different search." />
        ) : (
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
              {users.map((user) => {
                const wallet = user.wallets[0];
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <KycStatusBadge status={user.kyc?.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {wallet ? formatMoney(wallet.balance) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), "d MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {wallet ? (
                        <CreditWalletDialog
                          walletId={wallet.id}
                          subject={user.email}
                          trigger={
                            <Button size="sm" variant="outline">
                              <Wallet /> Credit
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
