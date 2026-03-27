"use client";

import { memo, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  label?: string;
}

function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  label = "activities",
}: PaginationProps) {
  // Memoize computed values
  const { startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { startIndex: start, endIndex: end };
  }, [currentPage, pageSize, totalItems]);

  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-secondary text-sm">
        Showing {startIndex} - {endIndex} of {totalItems} {label}
      </div>
      <div className="flex items-center justify-center gap-4">
        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm  text-primary">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default memo(CustomPagination);
