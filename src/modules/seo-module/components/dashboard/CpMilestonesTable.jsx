import { useState } from "react";
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
} from "@/components/ui/pagination";
import { CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS_PER_PAGE = 10;

const CpMilestonesTable = ({ milestones }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(milestones.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = milestones.slice(start, start + ITEMS_PER_PAGE);
const getCellBackgroundColor = (isAchieved) => {
  return isAchieved ? "bg-green-50" : "bg-red-50";
};
  return (
    <div className="border rounded-lg">
    <CardHeader className="py-5">
        <CardTitle className="text-3xl">CP Milestones</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>CP Milestones</TableHead>
              <TableHead>Date</TableHead>
              {/* <TableHead>Note</TableHead> */}
              <TableHead>Message</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((m, index) => {
              const isAchieved = m.status === "achieved";
              return (
                // <TableRow key={index} className={getCellBackgroundColor(isAchieved)}>
                <TableRow key={index}>
                  <TableCell>{m.keywords_target}</TableCell>
                  <TableCell>-</TableCell> {/* No date field */}
                  {/* <TableCell>-</TableCell> No note */}
                  <TableCell>Achieved {m.impressions_actual} impressions</TableCell>
                  <TableCell>{m.due_date || "-"}</TableCell>
                  
                  <TableCell
                    // className={isAchieved ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100"}
                  >
                    <span className={isAchieved ? "text-green-600" : "text-red-600"}>
                      {isAchieved ? "Achieved" : "Not Achieved"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (page === currentPage - 3 || page === currentPage + 3) return <PaginationEllipsis key={page} />;
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CpMilestonesTable;