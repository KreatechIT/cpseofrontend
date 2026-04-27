import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { formatDateShort } from "../../lib/dateUtils";

// Central Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PurchasedPoolTable = ({ purchased, pagination, currentPage, onPageChange }) => {
  if (!purchased || purchased.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No purchased links found.
      </p>
    );
  }

  // Calculate display range
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(startItem + purchased.length - 1, pagination.total);

  return (
    <div className="space-y-4">
      {/* Pagination Info */}


      <ScrollArea className="rounded-md border ">
        <Table>
          <TableHeader
            className="sticky top-0 z-10"
            style={{ background: "#3872FA33" }}
          >
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Backlinks ID</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Order Month</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Link Type</TableHead>
              <TableHead>Price Per Link (USD)</TableHead>
              <TableHead>Price Per Link (MYR)</TableHead>
              <TableHead>Unique Domain</TableHead>
              <TableHead>Live Link</TableHead>
              <TableHead>Latest Live Link Index</TableHead>
              <TableHead>Unique Domain Index</TableHead>
              <TableHead>Keyword (1)</TableHead>
              <TableHead>Target URL (1)</TableHead>
              <TableHead>Keyword (2)</TableHead>
              <TableHead>Target URL (2)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Link Status</TableHead>
              <TableHead>Follow</TableHead>
              <TableHead>Domain Rating</TableHead>
              <TableHead>Domain Authority</TableHead>
              <TableHead>Page Authority</TableHead>
              <TableHead>Spam Score</TableHead>
              <TableHead>Domain Created </TableHead>
              <TableHead>Domain Expiration </TableHead>
              <TableHead>Domain Age</TableHead>
              <TableHead>Remark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchased.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {startItem + index}
                </TableCell>
                <TableCell>{item.project_name || "-"}</TableCell>
                <TableCell className="font-medium">
                  {item.backlinks_id || "-"}
                </TableCell>
                <TableCell>
                  {item.created
                    ? format(new Date(item.created), "dd/MM/yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.order_month
                    ? formatDateShort(item.order_month, true)
                    : "-"}
                </TableCell>
                <TableCell>{item.domain || "-"}</TableCell>
                <TableCell>{item.vendor_name || "-"}</TableCell>
                <TableCell>{item.link_type || "-"}</TableCell>
                <TableCell className="text-right">
                  {item.price_usd || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {item.price_myr || "-"}
                </TableCell>
                <TableCell>{item.unique_domain || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  <a
                    href={item.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.live_link}
                  </a>
                </TableCell>
                <TableCell>
                  {item.latest_live_link_index || "Not Indexed"}
                </TableCell>
                <TableCell>
                  {item.unique_domain_index || "Not Indexed"}
                </TableCell>
                <TableCell>{item.keyword_1 || "-"}</TableCell>
                <TableCell>
                  {item.target_url_1 ? (
                    <a
                      href={item.target_url_1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {item.target_url_1}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.keyword_2 || "-"}</TableCell>
                <TableCell>
                  {item.target_url_2 ? (
                    <a
                      href={item.target_url_2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {item.target_url_2}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.status || "-"}</TableCell>
                <TableCell>{item.link_status || "-"}</TableCell>
                <TableCell>{item.follow || "-"}</TableCell>
                <TableCell>
                  {item.domain_rating
                    ? parseFloat(item.domain_rating) < 1
                      ? parseFloat(item.domain_rating).toFixed(1)
                      : Math.round(parseFloat(item.domain_rating))
                    : "-"}
                </TableCell>
                <TableCell>{item.domain_authority || "-"}</TableCell>
                <TableCell>{item.page_authority || "-"}</TableCell>
                <TableCell>{item.spam_score || "-"}</TableCell>
                <TableCell>
                  {item.domain_created_date
                    ? format(new Date(item.domain_created_date), "dd/MM/yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.domain_expiration_date
                    ? format(new Date(item.domain_expiration_date), "dd/MM/yyyy")
                    : "-"}
                </TableCell>
                <TableCell>{item.domain_age || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {item.remark || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Server-Side Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
              // Show ellipsis for long lists
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (page === currentPage - 3 || page === currentPage + 3) {
                return <PaginationEllipsis key={page} />;
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Showing {startItem} - {endItem} of {pagination.total} entries
        </span>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
      </div>
    </div>
  );
};

export default PurchasedPoolTable;
