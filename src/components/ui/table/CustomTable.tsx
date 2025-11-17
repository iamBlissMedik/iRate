"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { IDropdownItem } from "@/types/dropdownTypes";
import CustomDropdownMenu from "../CustomDropdownMenu";
import CustomPagination from "../CustomPagination";
import Loader from "@/components/Loader";
import { useDebounce } from "@/hooks/useDebounce";

interface CustomTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  title?: string;
  description?: string;
  rightHeader?: React.ReactNode;
  maxHeight?: string;
  selectedRowId?: string | null;
  onClearSelection?: () => void;

  /** Pagination */
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  paginationLabel?: string;

  /** Filter-related */
  filters?: ReactNode;
  showSearch?: boolean;
  showStatusFilter?: boolean;
  showCategoryFilter?: boolean;
  filterPlaceholder?: string;
  statusItems?: IDropdownItem[];
  categoryItems?: IDropdownItem[];

  /** Server-side filter handler */
  onFiltersChange?: (filters: {
    search?: string;
    status?: string;
    category?: string;
  }) => void;

  /** Optional row click handler */
  handleRowClick?: (row: TData, rowId: string) => void;
}

export const CustomTable = <TData, TValue>({
  columns,
  data,
  loading,
  title = "Table",
  description,
  rightHeader,
  maxHeight = "900px",
  selectedRowId,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  paginationLabel,
  filters,
  showSearch = true,
  showStatusFilter = false,
  showCategoryFilter = false,
  filterPlaceholder = "Search...",
  statusItems,
  categoryItems,
  onFiltersChange,
  handleRowClick,
}: CustomTableProps<TData, TValue>) => {
  /** Local states */
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  /** Debounce search value */
  const debouncedSearch = useDebounce(searchValue, 400);

  /** Prevent initial trigger */
  const isFirstRender = useRef(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /** 🔁 Trigger filters only when inputs change (not every render) */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onFiltersChange?.({
      search: debouncedSearch,
      status: statusValue,
      category: categoryValue,
    });

    // ✅ Removed `onFiltersChange` to prevent infinite reloads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusValue, categoryValue]);

  return (
    <Card>
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          {!loading && (
            <>
              <CardTitle className="sm:text-lg font-semibold text-primary">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-sm text-secondary">
                  {description}
                </CardDescription>
              )}
            </>
          )}
        </div>
        {rightHeader && <div>{rightHeader}</div>}
      </CardHeader>

      {/* Filters */}
      <CardContent className="space-y-4">
        <div className="flex sm:flex-row flex-col gap-2 sm:gap-4 w-full">
          {filters}

          {/* 🔍 Search */}
          {showSearch && (
            <div className="relative w-full max-w-[312px] mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              <Input
                placeholder={filterPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                className="pl-9 pr-9 focus-visible:ring-0 focus-visible:ring-secondary-2 focus-visible:border-secondary-2"
              />
              {!!searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Status */}
          {showStatusFilter && statusItems && (
            <CustomDropdownMenu
              items={statusItems}
              placeholder="Filter by Status"
              value={statusValue}
              onChange={(value) => setStatusValue(value === "all" ? "" : value)}
              widthClass="w-[180px]"
            />
          )}

          {/* Category */}
          {showCategoryFilter && categoryItems && (
            <CustomDropdownMenu
              items={categoryItems}
              placeholder="Filter by Category"
              value={categoryValue}
              onChange={(value) =>
                setCategoryValue(value === "all" ? "" : value)
              }
              widthClass="w-[268px]"
              inputWidth="w-[200px]"
            />
          )}
        </div>

        {/* 🧾 Table */}
        <div className={cn("overflow-y-auto")} style={{ maxHeight }}>
          {loading ? (
            <Loader />
          ) : (
            <Table>
              <TableHeader className="bg-[#EBEFF4]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {data?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        "hover:bg-[#F6F6F6]",
                        selectedRowId === row.id && "bg-accent",
                        handleRowClick && "cursor-pointer"
                      )}
                      onClick={() => handleRowClick?.(row.original, row.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-pre-wrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
      {(totalPages ?? 0) > 1 && !loading && (
        <CardFooter>
          <CustomPagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 0}
            onPageChange={onPageChange ?? (() => {})}
            pageSize={pageSize ?? 10}
            totalItems={totalItems ?? 0}
            label={paginationLabel}
          />
        </CardFooter>
      )}
    </Card>
  );
};
