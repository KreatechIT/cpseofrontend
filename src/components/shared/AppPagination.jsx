import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { usePagination } from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AppPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  totalItems = 0,
  itemsPerPage,
  setPaginationInfo,
  paginationOptionsType = "default", // "default" or "card"
}) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  const perPageOptions =
    paginationOptionsType === "card" ? [8, 16, 32, 48] : [10, 20, 30, 50];

  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      {/* Page number information */}
      <div className="text-muted-foreground flex grow text-sm whitespace-nowrap">
        <p aria-live="polite">
          Showing{" "}
          <span className="text-foreground">
            {start}-{end}
          </span>{" "}
          of <span className="text-foreground">{totalItems}</span>
        </p>
      </div>

      <div className="flex gap-4">
        {/* Pagination controls */}
        <div className="grow">
          <Pagination>
            <PaginationContent>
              {/* Previous page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    currentPage > 1 &&
                    setPaginationInfo((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  className="cursor-pointer aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  aria-disabled={currentPage === 1}
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>

              {/* Left ellipsis */}
              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Page numbers */}
              {pages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() =>
                      setPaginationInfo((prev) => ({
                        ...prev,
                        currentPage: page,
                      }))
                    }
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Right ellipsis */}
              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    currentPage < totalPages &&
                    setPaginationInfo((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage + 1,
                    }))
                  }
                  className="cursor-pointer aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  aria-disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Items per page selector */}
        <div className="flex flex-1 justify-end">
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) =>
              setPaginationInfo(() => ({
                currentPage: 1,
                itemsPerPage: Number(value),
              }))
            }
            aria-label="Results per page"
          >
            <SelectTrigger className="w-fit rounded-lg whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={`${option}`}>
                  {option} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
