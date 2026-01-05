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
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DeleteOrderConfirmation from "./DeleteOrderConfirmation"; // ← Same folder

const OrderManagementTableView = ({ filteredOrders }) => {
  const navigate = useNavigate();

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleEdit = (order) => {
    navigate(`/seo/order-management/edit/${order.id}`);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  return (
    <>
      <ScrollArea className="rounded-md border h-[calc(100vh-200px)]">
        <Table>
          <TableHeader className="sticky top-0 z-10" style={{background: "#3872FA33"}}>
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
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{order.project || "-"}</TableCell>
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
                  <TableCell>{order.vendor || "-"}</TableCell>
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
