import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Building2, Mail, Phone, Eye, EyeOff, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { getAllVendors } from "@/modules/seo-module/services/vendorDatabaseService"; // Adjust path
import { useSelector } from "react-redux";

const VendorDatabaseCardView = ({ filteredVendors }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleEdit = (vendor) => {
    navigate(`/seo/vendor/vendor-details/edit/${vendor.id}`);
  };

  const handleDeleteClick = (vendor) => {
    setVendorToDelete(vendor);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!vendorToDelete) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/seo/vendors/${vendorToDelete.id}/`);
      toast.success(`"${vendorToDelete.vendor_name}" deleted successfully!`);
      await getAllVendors(user.organisation_id, dispatch); // Refresh list
    } catch (error) {
      toast.error("Failed to delete vendor");
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setVendorToDelete(null);
    }
  };

  return (
    <>
      <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-6 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}

        {filteredVendors.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-12 text-lg">
            No vendors found
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              Delete Vendor
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-center space-y-4 py-4">
            <p className="text-base">
              Are you sure you want to delete the vendor
              <span className="font-bold text-foreground mx-1">
                "{vendorToDelete?.vendor_name}"
              </span>
              ?
            </p>
            <p className="text-destructive font-medium">
              This action cannot be undone.
            </p>
            <p className="text-sm text-muted-foreground">
              All associated data will be permanently removed.
            </p>
          </DialogDescription>

          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorDatabaseCardView;

// Card Component (cleaned up)
const VendorCard = ({ vendor, onEdit, onDelete }) => {
  const isHidden = vendor.visibility === "hidden";
  const visibilityIcon = isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />;

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow bg-[#3872FA1A] border border-[#3872FA]/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-white shadow">
              <AvatarImage src="" />
              <AvatarFallback className="bg-white">
                <Building2 className="h-7 w-7 text-[#3872FA]" />
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-bold text-lg text-[#3872FA]">
                {vendor.vendor_name || "Unnamed Vendor"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {vendor.business_type || "Vendor"}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm flex-1">
        {vendor.contact_person && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{vendor.contact_person}</span>
          </div>
        )}

        {(vendor.phone || vendor.whatsapp) && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{vendor.phone || vendor.whatsapp?.replace("wa.me/", "")}</span>
          </div>
        )}

        {vendor.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{vendor.email}</span>
          </div>
        )}

        {vendor.address && (
          <p className="text-sm text-muted-foreground mt-3">{vendor.address}</p>
        )}
      </CardContent>

      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Team ID: <span className="font-medium">{vendor.teams_id || "-"}</span>
          </span>
          <div className="flex items-center gap-2">
            {visibilityIcon}
            <span className={isHidden ? "text-destructive font-medium" : "font-medium"}>
              {isHidden ? "Hidden" : "Public"}
            </span>
          </div>
        </div>
      </div>

      <CardFooter className="pt-4 border-t bg-white/50">
        <div className="flex gap-3 w-full">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(vendor)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" className="flex-1" onClick={() => onDelete(vendor)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};