import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminPagination } from "@irate/contracts";
import { Button } from "@irate/ui";

/** Prev/next controls for the server-paginated admin lists. Hidden for a single page. */
export function TablePagination({
  pagination,
  onPageChange,
  disabled,
}: {
  pagination?: AdminPagination;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft /> Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
