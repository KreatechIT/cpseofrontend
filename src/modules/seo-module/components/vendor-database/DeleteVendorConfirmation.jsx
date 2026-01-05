import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { useState } from "react";
import { getAllVendors } from "@/modules/seo-module/services/vendorDatabaseService"; // Adjust path if needed
import { useDispatch, useSelector } from "react-redux";

const DeleteVendorConfirmation = ({ vendor, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/seo/vendors/${vendor.id}/`);
      toast.success(`Vendor "${vendor.vendor_name}" deleted successfully!`);
      await getAllVendors(user.organisation_id, dispatch); // Refetch vendors
      onClose();
    } catch (error) {
      toast.error("Failed to delete vendor");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 text-center space-y-6">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
      <h2 className="text-xl font-semibold">Delete Vendor</h2>
      <p className="text-muted-foreground">
        Are you sure you want to delete <strong>{vendor.vendor_name}</strong>?
        <br />
        This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Yes, Delete"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteVendorConfirmation;