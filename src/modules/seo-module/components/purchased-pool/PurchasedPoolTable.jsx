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

// Central Pagination components (adjust path if needed)
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const PurchasedPoolTable = ({ purchased }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when purchased data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [purchased]);

  if (!purchased || purchased.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No purchased links found.
      </p>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(purchased.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = purchased.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
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
              <TableHead>Domain Created Date</TableHead>
              <TableHead>Domain Expiration Date</TableHead>
              <TableHead>Domain Age</TableHead>
              <TableHead>Remark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {start + index + 1}
                </TableCell>
                <TableCell>{item.project_name || "-"}</TableCell>
                <TableCell className="font-medium">
                  {item.backlinks_id || "-"}
                </TableCell>
                <TableCell>
                  {item.created
                    ? format(new Date(item.created), "dd MMM yyyy")
                    : "-"}
                </TableCell>
                <TableCell> {item.order_month
                    ? format(new Date(item.order_month), "dd MMM yyyy")
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
                  {/* {item.live_link ? (
                    <a
                      href={item.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )} */}
                  <a
                    href={item.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.live_link}
                  </a>
                </TableCell>
                <TableCell>{item.latest_live_link_index || "Not Indexed"}</TableCell>
                <TableCell>{item.unique_domain_index || "Not Indexed"}</TableCell>
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
                    ? item.domain_rating < 1
                      ? item.domain_rating.toFixed(1)
                      : Math.round(item.domain_rating)
                    : "-"}
                </TableCell>
                <TableCell>{item.domain_authority || "-"}</TableCell>
                <TableCell>{item.page_authority || "-"}</TableCell>
                <TableCell>{item.spam_score || "-"}</TableCell>
                <TableCell>
                  {item.domain_created_date
                    ? format(new Date(item.domain_created_date), "dd MMM yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.domain_expiration_date
                    ? format(
                        new Date(item.domain_expiration_date),
                        "dd MMM yyyy"
                      )
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show ellipsis for long lists
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PurchasedPoolTable;
