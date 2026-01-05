import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { useState } from "react";
import { getAllOrders } from "../../services/orderManagementService";
import { useDispatch, useSelector } from "react-redux";

const DeleteOrderConfirmation = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!order?.id) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/seo/orders/${order.id}/`);
      toast.success(
        `Order "${order.transaction_id || order.id}" deleted successfully!`
      );

      // Refresh the orders list
      await getAllOrders(dispatch);

      onClose();
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="text-center space-y-6 py-6">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />

      <div>
        <h2 className="text-xl font-semibold">Delete Order</h2>
        <p className="mt-4 text-base text-muted-foreground">
          Are you sure you want to delete the order with Transaction ID:
        </p>
        <p className="mt-2 text-lg font-bold text-foreground">
          {order?.transaction_id || order?.id || "Unknown"}
        </p>
        <p className="mt-4 text-destructive font-medium">
          This action cannot be undone.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          All associated data will be permanently removed.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirmDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Yes, Delete Order"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteOrderConfirmation;
