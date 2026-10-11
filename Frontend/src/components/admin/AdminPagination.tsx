// src/components/admin/AdminPagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Rows per page for the admin tables that page through the server. */
export const ADMIN_PAGE_SIZE = 10;

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  /** Total rows across every page; shows "Showing 11–20 of 43 trips" when given. */
  totalItems?: number;
  pageSize?: number;
  /** Plural noun for the summary, e.g. "trips". */
  itemLabel?: string;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

// First and last page, the current page with a neighbour each side, and gaps
// in between: 1 … 4 5 6 … 12
const pageList = (page: number, totalPages: number): (number | "gap")[] => {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const list: (number | "gap")[] = [];
  pages.forEach((p, index) => {
    if (index > 0 && p - pages[index - 1] > 1) list.push("gap");
    list.push(p);
  });
  return list;
};

export function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize = ADMIN_PAGE_SIZE,
  itemLabel = "items",
  onPageChange,
  disabled = false,
}: AdminPaginationProps) {
  // Nothing to page through.
  if (totalPages <= 1 && !totalItems) return null;

  const first = (page - 1) * pageSize + 1;
  const last = totalItems !== undefined ? Math.min(page * pageSize, totalItems) : page * pageSize;

  return (
    <nav
      className="flex flex-col gap-3 p-4 border-t border-border sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground" data-testid="pagination-summary">
        {totalItems !== undefined
          ? `Showing ${first}–${last} of ${totalItems} ${itemLabel}`
          : `Page ${page} of ${totalPages}`}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {pageList(page, totalPages).map((entry, index) =>
            entry === "gap" ? (
              <span key={`gap-${index}`} className="px-1.5 text-sm text-muted-foreground" aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                key={entry}
                variant={entry === page ? "default" : "ghost"}
                size="sm"
                disabled={disabled}
                onClick={() => entry !== page && onPageChange(entry)}
                aria-label={`Page ${entry}`}
                aria-current={entry === page ? "page" : undefined}
                className={cn("min-w-9 px-2", entry === page && "pointer-events-none")}
              >
                {entry}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={disabled || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight />
          </Button>
        </div>
      )}
    </nav>
  );
}
