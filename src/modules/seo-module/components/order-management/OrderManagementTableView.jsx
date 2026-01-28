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
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DeleteOrderConfirmation from "./DeleteOrderConfirmation";

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

const OrderManagementTableView = ({ filteredOrders }) => {
  const navigate = useNavigate();

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filteredOrders changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  const handleEdit = (order) => {
    navigate(`/seo/order-management/edit/${order.id}`);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">No orders found.</p>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredOrders.slice(start, start + ITEMS_PER_PAGE);

  return (
    <>
      <div className="space-y-4">
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader
              className="sticky top-0 z-10"
              style={{ background: "#3872FA33" }}
            >
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Project ID</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Order Month</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Link Type</TableHead>
                <TableHead>Total Links</TableHead>
                <TableHead>Price Per Link (USD)</TableHead>
                <TableHead>Price Per Link (MYR)</TableHead>
                <TableHead>Total USD</TableHead>
                <TableHead>Total MYR</TableHead>
                <TableHead>Dripfeed Day</TableHead>
                <TableHead>File Received Date</TableHead>
                <TableHead>Order Report</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {start + index + 1}
                    </TableCell>
                    <TableCell>{order.project_name || "-"}</TableCell>
                    <TableCell className="font-medium">
                      {order.transaction_id || "-"}
                    </TableCell>
                    <TableCell>
                      {order.created
                        ? format(new Date(order.created), "dd MMM yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{order.order_month || "-"}</TableCell>
                    <TableCell>{order.domain || "-"}</TableCell>
                    <TableCell>{order.vendor_name || "-"}</TableCell>
                    <TableCell>{order.link_type || "-"}</TableCell>
                    <TableCell className="text-right">
                      {order.total_links || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.price_per_link_usd || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.price_per_link_myr || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.total_usd || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.total_myr || "-"}
                    </TableCell>
                    <TableCell>{order.dripfeed_day || "-"}</TableCell>
                    <TableCell>
                      {order.file_received_date
                        ? format(
                            new Date(order.file_received_date),
                            "dd MMM yyyy"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(order)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(order)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={17}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No orders found.
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
                }
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

      {/* Reusable Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedOrder && (
            <DeleteOrderConfirmation
              order={selectedOrder}
              onClose={() => setDeleteOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderManagementTableView;
