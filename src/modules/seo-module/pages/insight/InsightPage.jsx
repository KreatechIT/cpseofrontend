import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInsightData } from "../../services/insightService";
import { PageHeading } from "@/components/shared/PageHeading";
import InsightTable from "../../components/insight/InsightTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { TableSkeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

const InsightPage = () => {
  const dispatch = useDispatch();
  const { purchased, samples, competitorPool, loading } = useSelector(
    (state) => state.insight,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInsightData(dispatch);
  }, [dispatch]);

  // Safe array concatenation
  const allData = [
    ...(Array.isArray(purchased) ? purchased : []),
    ...(Array.isArray(samples) ? samples : []),
    ...(Array.isArray(competitorPool) ? competitorPool : []),
  ];

  // Prepare vendor summary data with correct field mapping
  const vendorSummaryData = allData
    .filter(
      (row) =>
        row?.vendor_name ||
        row?.vendor ||
        row?.associated_vendors ||
        row?.price_usd ||
        row?.discovered_date ||
        row?.created_date ||
        row?.first_seen,
    )
    .map((row, index) => ({
      no: index + 1,
      // Associated Vendors (array → joined string)
      associated: Array.isArray(row.associated_vendors)
        ? row.associated_vendors.join(", ") || "-"
        : row.associated_vendors || row.vendor || "-",
      // Vendors (prefer readable name)
      vendors: row.vendor_name || row.vendor || "-",
      // Price (prefer price_usd, fallback to others)
      price: row.price_usd
        ? `$${row.price_usd}`
        : row.price_usd_general || row.price_usd_niche || "-",
      // Note / Remark
      note: row.remark || row.note || "-",
      // Discovered Date (multiple possible fields)
      discoveredDate:
        row.discovered_date ||
        row.created_date ||
        row.first_seen ||
        row.lowest_price_date ||
        "-",
      // Discovered By (prefer name)
      discoveredBy: row.discovered_by_name || row.discovered_by || "-",
      // Overlap Competitors (array → joined)
      overlapCompetitors: Array.isArray(row.overlap_competitors)
        ? row.overlap_competitors.join(", ") || "-"
        : row.overlap_competitors || "-",
      // Project Consists Link (array → joined)
      projectConsistsLink: Array.isArray(row.project_consists_link)
        ? row.project_consists_link.join(", ") || "-"
        : row.project_consists_link || "-",
    }));

  // Pagination logic for modal
  const totalPages = Math.ceil(vendorSummaryData.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = vendorSummaryData.slice(start, start + ITEMS_PER_PAGE);

  // Reset page when modal opens
  useEffect(() => {
    if (modalOpen) setCurrentPage(1);
  }, [modalOpen]);

  return (
    <>
      <title>Insight - Core360</title>
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <PageHeading pageTitle="Insight" />
          <Button onClick={() => setModalOpen(true)}>Vendor Summary</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <TableSkeleton />
          </div>
        ) : (
          <InsightTable
            data={allData}
            onOpenVendorSummary={() => setModalOpen(true)}
          />
        )}
      </main>

      {/* Vendor Summary Modal with Pagination */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden w-full sm:max-w-xxl">
          <DialogHeader>
            <DialogTitle>VENDOR SUMMARY</DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-auto flex flex-col h-full">
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>No</TableHead>
                    {/* <TableHead>Associated</TableHead> */}
                    <TableHead>Vendors</TableHead>
                    <TableHead>Price</TableHead>
                    {/* <TableHead>Note</TableHead> */}
                    <TableHead>Discovered Date</TableHead>
                    <TableHead>Discovered By</TableHead>
                    <TableHead>Overlap Competitors</TableHead>
                    <TableHead>Project Consists Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <TableRow key={item.no}>
                        <TableCell>{item.no}</TableCell>
                        {/* <TableCell>{item.associated}</TableCell> */}
                        <TableCell>{item.vendors}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        {/* <TableCell>{item.note}</TableCell> */}
                        <TableCell>{item.discoveredDate}</TableCell>
                        <TableCell>{item.discoveredBy}</TableCell>
                        <TableCell>{item.overlapCompetitors}</TableCell>
                        <TableCell>{item.projectConsistsLink}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No vendor data available
                      </TableCell>
                    </TableRow>
                  )}
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show ellipsis logic for long lists
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
                      if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return <PaginationEllipsis key={page} />;
                      }
                      return null;
                    },
                  )}

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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InsightPage;
