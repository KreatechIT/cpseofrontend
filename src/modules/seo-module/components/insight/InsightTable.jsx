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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // your central component

const ITEMS_PER_PAGE = 10;

const InsightTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No data available
      </p>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Unique Domain</TableHead>
              <TableHead>Live Link</TableHead>
              <TableHead>Domain Rating</TableHead>
              <TableHead>URL Rating</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Domain Authority</TableHead>
              <TableHead>Page Authority</TableHead>
              <TableHead>Spam Score</TableHead>
              <TableHead>Target URL</TableHead>
              <TableHead>Anchor Text</TableHead>
              <TableHead>Domain Traffic</TableHead>
              <TableHead>Referring Domains</TableHead>
              <TableHead>Linked Domains</TableHead>
              <TableHead>External Links</TableHead>
              <TableHead>Page Traffic</TableHead>
              <TableHead>Total Organic Keyword</TableHead>
              <TableHead>Redirect Chain URLs</TableHead>
              <TableHead>Follow</TableHead>
              <TableHead>First Seen</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id || index}>
                <TableCell>{start + index + 1}</TableCell>
                <TableCell>{row.unique_domain || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {row.live_link ? (
                    <a
                      href={row.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {row.live_link}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{row.domain_rating || "-"}</TableCell>
                <TableCell>
                  {row.url_rating || row.page_authority || "-"}
                </TableCell>
                <TableCell>{row.remark || row.note || "-"}</TableCell>
                <TableCell>{row.domain_authority || "-"}</TableCell>
                <TableCell>{row.page_authority || "-"}</TableCell>
                <TableCell>{row.spam_score || "-"}</TableCell>
                <TableCell>
                  {row.target_url_1 || row.target_url || "-"}
                </TableCell>
                <TableCell>
                  {row.keyword_1 || row.anchor || row.anchor_text || "-"}
                </TableCell>
                <TableCell>
                  {row.traffic || row.domain_traffic || "-"}
                </TableCell>
                <TableCell>{row.referring_domains || "-"}</TableCell>
                <TableCell>{row.linked_domains || "-"}</TableCell>
                <TableCell>{row.external_links || "-"}</TableCell>
                <TableCell>{row.page_traffic || "-"}</TableCell>
                <TableCell>{row.total_organic_keywords || "-"}</TableCell>
                <TableCell>{row.redirect_chain_urls || "-"}</TableCell>
                <TableCell>{row.follow || "-"}</TableCell>
                <TableCell>{row.first_seen || "-"}</TableCell>
                <TableCell>{row.last_seen || "-"}</TableCell>
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

export default InsightTable;
